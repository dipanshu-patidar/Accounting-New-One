const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate invoice number
const generateInvoiceNumber = async (companyId) => {
    const count = await prisma.purchaseInvoice.count({ where: { companyId } });
    return `PUR-${String(count + 1).padStart(5, '0')}`;
};

// Get all purchase invoices for a company
const getInvoices = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { status, vendorId } = req.query;

        const where = { companyId };
        if (status) where.status = status;
        if (vendorId) where.vendorId = parseInt(vendorId);

        const invoices = await prisma.purchaseInvoice.findMany({
            where,
            include: {
                vendor: { select: { id: true, name: true, email: true, phone: true } },
                _count: { select: { items: true, payments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching purchase invoices:', error);
        res.status(500).json({ message: 'Failed to fetch purchase invoices' });
    }
};

// Get single purchase invoice with details
const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const invoice = await prisma.purchaseInvoice.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                vendor: true,
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
                debitNotes: true
            }
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Purchase invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Error fetching purchase invoice:', error);
        res.status(500).json({ message: 'Failed to fetch purchase invoice' });
    }
};

// Create purchase invoice
const createInvoice = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {
            vendorId,
            vendorInvoiceNo,
            invoiceDate,
            dueDate,
            referenceNumber,
            billingAddress,
            shippingAddress,
            notes,
            terms,
            items // Array of line items
        } = req.body;

        if (!vendorId || !dueDate || !items || items.length === 0) {
            return res.status(400).json({ message: 'Vendor, due date, and at least one item are required' });
        }

        // Verify vendor exists
        const vendor = await prisma.vendor.findFirst({
            where: { id: parseInt(vendorId), companyId }
        });
        if (!vendor) {
            return res.status(400).json({ message: 'Vendor not found' });
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
            const newInvoice = await tx.purchaseInvoice.create({
                data: {
                    invoiceNumber,
                    vendorId: parseInt(vendorId),
                    vendorInvoiceNo,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
                    dueDate: new Date(dueDate),
                    referenceNumber,
                    billingAddress: billingAddress || vendor.address,
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
                    vendor: true,
                    items: true
                }
            });

            // Add stock for products (purchase adds inventory)
            for (const item of processedItems) {
                if (item.productId && item.warehouseId) {
                    // Check if stock record exists
                    const existingStock = await tx.productStock.findUnique({
                        where: {
                            productId_warehouseId: {
                                productId: item.productId,
                                warehouseId: item.warehouseId
                            }
                        }
                    });

                    if (existingStock) {
                        await tx.productStock.update({
                            where: {
                                productId_warehouseId: {
                                    productId: item.productId,
                                    warehouseId: item.warehouseId
                                }
                            },
                            data: {
                                quantity: { increment: item.quantity }
                            }
                        });
                    } else {
                        await tx.productStock.create({
                            data: {
                                productId: item.productId,
                                warehouseId: item.warehouseId,
                                quantity: item.quantity,
                                initialQty: item.quantity
                            }
                        });
                    }
                }
            }

            return newInvoice;
        });

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating purchase invoice:', error);
        res.status(500).json({ message: 'Failed to create purchase invoice' });
    }
};

// Update purchase invoice
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const { status, notes, terms, dueDate, vendorInvoiceNo } = req.body;

        const existing = await prisma.purchaseInvoice.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Purchase invoice not found' });
        }

        const invoice = await prisma.purchaseInvoice.update({
            where: { id: parseInt(id) },
            data: {
                status: status || existing.status,
                notes: notes !== undefined ? notes : existing.notes,
                terms: terms !== undefined ? terms : existing.terms,
                dueDate: dueDate ? new Date(dueDate) : existing.dueDate,
                vendorInvoiceNo: vendorInvoiceNo !== undefined ? vendorInvoiceNo : existing.vendorInvoiceNo
            },
            include: {
                vendor: true,
                items: true
            }
        });

        res.json(invoice);
    } catch (error) {
        console.error('Error updating purchase invoice:', error);
        res.status(500).json({ message: 'Failed to update purchase invoice' });
    }
};

// Delete purchase invoice
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const existing = await prisma.purchaseInvoice.findFirst({
            where: { id: parseInt(id), companyId },
            include: { payments: true, items: true }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Purchase invoice not found' });
        }

        // Don't allow deletion if payments exist
        if (existing.payments.length > 0) {
            return res.status(400).json({ message: 'Cannot delete purchase invoice with payments. Void the payments first.' });
        }

        // Remove stock for products (reverse the purchase)
        await prisma.$transaction(async (tx) => {
            for (const item of existing.items) {
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

            await tx.purchaseInvoice.delete({
                where: { id: parseInt(id) }
            });
        });

        res.json({ message: 'Purchase invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting purchase invoice:', error);
        res.status(500).json({ message: 'Failed to delete purchase invoice' });
    }
};

// Receive purchase invoice (change status from DRAFT to RECEIVED)
const receiveInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const invoice = await prisma.purchaseInvoice.updateMany({
            where: { id: parseInt(id), companyId, status: 'DRAFT' },
            data: { status: 'RECEIVED' }
        });

        if (invoice.count === 0) {
            return res.status(400).json({ message: 'Purchase invoice not found or already received' });
        }

        res.json({ message: 'Purchase invoice marked as received' });
    } catch (error) {
        console.error('Error receiving purchase invoice:', error);
        res.status(500).json({ message: 'Failed to receive purchase invoice' });
    }
};

module.exports = {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    receiveInvoice
};
