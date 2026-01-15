const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate invoice number
const generateInvoiceNumber = async (companyId) => {
    const count = await prisma.salesInvoice.count({ where: { companyId } });
    return `INV-${String(count + 1).padStart(5, '0')}`;
};

// Get all invoices for a company
const getInvoices = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { status, customerId } = req.query;

        const where = { companyId };
        if (status) where.status = status;
        if (customerId) where.customerId = parseInt(customerId);

        const invoices = await prisma.salesInvoice.findMany({
            where,
            include: {
                customer: { select: { id: true, name: true, email: true, phone: true } },
                _count: { select: { items: true, payments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Failed to fetch invoices' });
    }
};

// Get single invoice with details
const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const invoice = await prisma.salesInvoice.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                customer: true,
                items: {
                    include: {
                        product: { select: { id: true, name: true, sku: true } },
                        service: { select: { id: true, name: true } },
                        warehouse: { select: { id: true, name: true } }
                    }
                },
                payments: {
                    orderBy: { paymentDate: 'desc' }
                },
                creditNotes: true
            }
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ message: 'Failed to fetch invoice' });
    }
};

// Create invoice
const createInvoice = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {
            customerId,
            invoiceDate,
            dueDate,
            referenceNumber,
            billingAddress,
            shippingAddress,
            notes,
            terms,
            items // Array of line items
        } = req.body;

        if (!customerId || !dueDate || !items || items.length === 0) {
            return res.status(400).json({ message: 'Customer, due date, and at least one item are required' });
        }

        // Verify customer exists
        const customer = await prisma.customer.findFirst({
            where: { id: parseInt(customerId), companyId }
        });
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }

        // Generate invoice number
        const invoiceNumber = await generateInvoiceNumber(companyId);

        // Calculate totals from items
        let subTotal = 0;
        let discountAmount = 0;
        let taxAmount = 0;

        const processedItems = items.map(item => {
            const qty = parseFloat(item.quantity) || 1;
            const unitPrice = parseFloat(item.unitPrice) || 0;
            const discPct = parseFloat(item.discountPercent) || 0;
            const taxPct = parseFloat(item.taxPercent) || 0;

            const lineSubtotal = qty * unitPrice;
            const lineDiscount = (lineSubtotal * discPct) / 100;
            const taxableAmount = lineSubtotal - lineDiscount;
            const lineTax = (taxableAmount * taxPct) / 100;
            const lineTotal = taxableAmount + lineTax;

            subTotal += lineSubtotal;
            discountAmount += lineDiscount;
            taxAmount += lineTax;

            return {
                productId: item.productId ? parseInt(item.productId) : null,
                serviceId: item.serviceId ? parseInt(item.serviceId) : null,
                warehouseId: item.warehouseId ? parseInt(item.warehouseId) : null,
                description: item.description,
                quantity: qty,
                unitPrice: unitPrice,
                discountPercent: discPct,
                discountAmount: lineDiscount,
                taxPercent: taxPct,
                taxAmount: lineTax,
                totalAmount: lineTotal
            };
        });

        const totalAmount = subTotal - discountAmount + taxAmount;

        // Create invoice with items in transaction
        const invoice = await prisma.$transaction(async (tx) => {
            const newInvoice = await tx.salesInvoice.create({
                data: {
                    invoiceNumber,
                    customerId: parseInt(customerId),
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
                    dueDate: new Date(dueDate),
                    referenceNumber,
                    billingAddress: billingAddress || customer.address,
                    shippingAddress,
                    subTotal,
                    discountAmount,
                    taxAmount,
                    totalAmount,
                    dueAmount: totalAmount,
                    status: 'DRAFT',
                    notes,
                    terms,
                    companyId,
                    items: {
                        create: processedItems
                    }
                },
                include: {
                    customer: true,
                    items: true
                }
            });

            // Deduct stock for products
            for (const item of processedItems) {
                if (item.productId && item.warehouseId) {
                    await tx.productStock.updateMany({
                        where: {
                            productId: item.productId,
                            warehouseId: item.warehouseId
                        },
                        data: {
                            quantity: { decrement: item.quantity }
                        }
                    });
                }
            }

            return newInvoice;
        });

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: 'Failed to create invoice' });
    }
};

// Update invoice
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const { status, notes, terms, dueDate } = req.body;

        const existing = await prisma.salesInvoice.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Only allow updating status, notes, terms, dueDate
        const invoice = await prisma.salesInvoice.update({
            where: { id: parseInt(id) },
            data: {
                status: status || existing.status,
                notes: notes !== undefined ? notes : existing.notes,
                terms: terms !== undefined ? terms : existing.terms,
                dueDate: dueDate ? new Date(dueDate) : existing.dueDate
            },
            include: {
                customer: true,
                items: true
            }
        });

        res.json(invoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ message: 'Failed to update invoice' });
    }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const existing = await prisma.salesInvoice.findFirst({
            where: { id: parseInt(id), companyId },
            include: { payments: true, items: true }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Don't allow deletion if payments exist
        if (existing.payments.length > 0) {
            return res.status(400).json({ message: 'Cannot delete invoice with payments. Void the payments first.' });
        }

        // Restore stock for products
        await prisma.$transaction(async (tx) => {
            for (const item of existing.items) {
                if (item.productId && item.warehouseId) {
                    await tx.productStock.updateMany({
                        where: {
                            productId: item.productId,
                            warehouseId: item.warehouseId
                        },
                        data: {
                            quantity: { increment: item.quantity }
                        }
                    });
                }
            }

            await tx.salesInvoice.delete({
                where: { id: parseInt(id) }
            });
        });

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ message: 'Failed to delete invoice' });
    }
};

// Send invoice (change status)
const sendInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const invoice = await prisma.salesInvoice.updateMany({
            where: { id: parseInt(id), companyId, status: 'DRAFT' },
            data: { status: 'SENT' }
        });

        if (invoice.count === 0) {
            return res.status(400).json({ message: 'Invoice not found or already sent' });
        }

        res.json({ message: 'Invoice sent successfully' });
    } catch (error) {
        console.error('Error sending invoice:', error);
        res.status(500).json({ message: 'Failed to send invoice' });
    }
};

module.exports = {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice
};
