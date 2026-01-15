const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate receipt number
const generateReceiptNumber = async (companyId) => {
    const count = await prisma.paymentReceipt.count({ where: { companyId } });
    return `RCP-${String(count + 1).padStart(5, '0')}`;
};

// Get all payment receipts for a company
const getPayments = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { customerId, invoiceId } = req.query;

        const where = { companyId };
        if (customerId) where.customerId = parseInt(customerId);
        if (invoiceId) where.invoiceId = parseInt(invoiceId);

        const payments = await prisma.paymentReceipt.findMany({
            where,
            include: {
                customer: { select: { id: true, name: true } },
                invoice: { select: { id: true, invoiceNumber: true, totalAmount: true, dueAmount: true } }
            },
            orderBy: { paymentDate: 'desc' }
        });

        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Failed to fetch payments' });
    }
};

// Get single payment receipt
const getPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const payment = await prisma.paymentReceipt.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                customer: true,
                invoice: {
                    include: { items: true }
                }
            }
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ message: 'Failed to fetch payment' });
    }
};

// Create payment receipt
const createPayment = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {
            invoiceId,
            paymentDate,
            amount,
            paymentMethod,
            referenceNumber,
            notes
        } = req.body;

        if (!invoiceId || !amount) {
            return res.status(400).json({ message: 'Invoice and amount are required' });
        }

        // Verify invoice exists and get details
        const invoice = await prisma.salesInvoice.findFirst({
            where: { id: parseInt(invoiceId), companyId }
        });
        if (!invoice) {
            return res.status(400).json({ message: 'Invoice not found' });
        }

        const paymentAmount = parseFloat(amount);
        if (paymentAmount <= 0) {
            return res.status(400).json({ message: 'Payment amount must be greater than 0' });
        }

        if (paymentAmount > invoice.dueAmount) {
            return res.status(400).json({
                message: `Payment amount (${paymentAmount}) exceeds due amount (${invoice.dueAmount})`
            });
        }

        // Generate receipt number
        const receiptNumber = await generateReceiptNumber(companyId);

        // Create payment and update invoice in transaction
        const payment = await prisma.$transaction(async (tx) => {
            const newPayment = await tx.paymentReceipt.create({
                data: {
                    receiptNumber,
                    invoiceId: parseInt(invoiceId),
                    customerId: invoice.customerId,
                    paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
                    amount: paymentAmount,
                    paymentMethod: paymentMethod || 'BANK_TRANSFER',
                    referenceNumber,
                    notes,
                    companyId
                },
                include: {
                    customer: true,
                    invoice: true
                }
            });

            // Update invoice amounts
            const newPaidAmount = invoice.paidAmount + paymentAmount;
            const newDueAmount = invoice.totalAmount - newPaidAmount;

            let newStatus = invoice.status;
            if (newDueAmount <= 0) {
                newStatus = 'PAID';
            } else if (newPaidAmount > 0) {
                newStatus = 'PARTIALLY_PAID';
            }

            await tx.salesInvoice.update({
                where: { id: parseInt(invoiceId) },
                data: {
                    paidAmount: newPaidAmount,
                    dueAmount: newDueAmount,
                    status: newStatus
                }
            });

            // Update customer balance (reduce AR)
            await tx.customer.update({
                where: { id: invoice.customerId },
                data: {
                    currentBalance: { decrement: paymentAmount }
                }
            });

            // Create ledger entry for payment
            const cashAccount = await tx.chartOfAccounts.findFirst({
                where: { code: '1100', companyId }
            });

            if (cashAccount) {
                // Debit Cash, Credit AR
                await tx.ledgerEntry.createMany({
                    data: [
                        {
                            accountId: cashAccount.id,
                            date: newPayment.paymentDate,
                            entryType: 'DEBIT',
                            amount: paymentAmount,
                            narration: `Payment received - ${receiptNumber}`,
                            referenceType: 'PAYMENT',
                            referenceId: newPayment.id,
                            companyId
                        }
                    ]
                });

                // Update cash balance
                await tx.chartOfAccounts.update({
                    where: { id: cashAccount.id },
                    data: { currentBalance: { increment: paymentAmount } }
                });
            }

            return newPayment;
        });

        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Failed to create payment' });
    }
};

// Delete payment (void)
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const existing = await prisma.paymentReceipt.findFirst({
            where: { id: parseInt(id), companyId },
            include: { invoice: true }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Reverse the payment in transaction
        await prisma.$transaction(async (tx) => {
            // Update invoice amounts
            const invoice = existing.invoice;
            const newPaidAmount = invoice.paidAmount - existing.amount;
            const newDueAmount = invoice.totalAmount - newPaidAmount;

            let newStatus = 'SENT';
            if (newDueAmount <= 0) {
                newStatus = 'PAID';
            } else if (newPaidAmount > 0) {
                newStatus = 'PARTIALLY_PAID';
            }

            await tx.salesInvoice.update({
                where: { id: invoice.id },
                data: {
                    paidAmount: newPaidAmount,
                    dueAmount: newDueAmount,
                    status: newStatus
                }
            });

            // Restore customer balance
            await tx.customer.update({
                where: { id: existing.customerId },
                data: {
                    currentBalance: { increment: existing.amount }
                }
            });

            // Delete the payment
            await tx.paymentReceipt.delete({
                where: { id: parseInt(id) }
            });
        });

        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Failed to delete payment' });
    }
};

// Get invoices with balance for payment selection
const getInvoicesForPayment = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { customerId } = req.query;

        const where = {
            companyId,
            dueAmount: { gt: 0 },
            status: { in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] }
        };
        if (customerId) where.customerId = parseInt(customerId);

        const invoices = await prisma.salesInvoice.findMany({
            where,
            select: {
                id: true,
                invoiceNumber: true,
                invoiceDate: true,
                dueDate: true,
                totalAmount: true,
                paidAmount: true,
                dueAmount: true,
                customer: { select: { id: true, name: true } }
            },
            orderBy: { dueDate: 'asc' }
        });

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices for payment:', error);
        res.status(500).json({ message: 'Failed to fetch invoices' });
    }
};

module.exports = {
    getPayments,
    getPayment,
    createPayment,
    deletePayment,
    getInvoicesForPayment
};
