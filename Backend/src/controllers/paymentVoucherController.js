const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate voucher number
const generateVoucherNumber = async (companyId) => {
    const count = await prisma.paymentVoucher.count({ where: { companyId } });
    return `PV-${String(count + 1).padStart(5, '0')}`;
};

// Get all payment vouchers for a company
const getPayments = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { vendorId, invoiceId } = req.query;

        const where = { companyId };
        if (vendorId) where.vendorId = parseInt(vendorId);
        if (invoiceId) where.invoiceId = parseInt(invoiceId);

        const payments = await prisma.paymentVoucher.findMany({
            where,
            include: {
                vendor: { select: { id: true, name: true } },
                invoice: { select: { id: true, invoiceNumber: true, totalAmount: true, dueAmount: true } }
            },
            orderBy: { paymentDate: 'desc' }
        });

        res.json(payments);
    } catch (error) {
        console.error('Error fetching payment vouchers:', error);
        res.status(500).json({ message: 'Failed to fetch payment vouchers' });
    }
};

// Get single payment voucher
const getPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const payment = await prisma.paymentVoucher.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                vendor: true,
                invoice: {
                    include: { items: true }
                }
            }
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment voucher not found' });
        }

        res.json(payment);
    } catch (error) {
        console.error('Error fetching payment voucher:', error);
        res.status(500).json({ message: 'Failed to fetch payment voucher' });
    }
};

// Create payment voucher
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
        const invoice = await prisma.purchaseInvoice.findFirst({
            where: { id: parseInt(invoiceId), companyId }
        });
        if (!invoice) {
            return res.status(400).json({ message: 'Purchase invoice not found' });
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

        // Generate voucher number
        const voucherNumber = await generateVoucherNumber(companyId);

        // Create payment and update invoice in transaction
        const payment = await prisma.$transaction(async (tx) => {
            const newPayment = await tx.paymentVoucher.create({
                data: {
                    voucherNumber,
                    invoiceId: parseInt(invoiceId),
                    vendorId: invoice.vendorId,
                    paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
                    amount: paymentAmount,
                    paymentMethod: paymentMethod || 'BANK_TRANSFER',
                    referenceNumber,
                    notes,
                    companyId
                },
                include: {
                    vendor: true,
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

            await tx.purchaseInvoice.update({
                where: { id: parseInt(invoiceId) },
                data: {
                    paidAmount: newPaidAmount,
                    dueAmount: newDueAmount,
                    status: newStatus
                }
            });

            // Update vendor balance (reduce AP)
            await tx.vendor.update({
                where: { id: invoice.vendorId },
                data: {
                    currentBalance: { decrement: paymentAmount }
                }
            });

            // Create ledger entry for payment
            const cashAccount = await tx.chartOfAccounts.findFirst({
                where: { code: '1100', companyId }
            });

            if (cashAccount) {
                // Credit Cash (payment going out), Debit AP
                await tx.ledgerEntry.createMany({
                    data: [
                        {
                            accountId: cashAccount.id,
                            date: newPayment.paymentDate,
                            entryType: 'CREDIT',
                            amount: paymentAmount,
                            narration: `Payment to vendor - ${voucherNumber}`,
                            referenceType: 'PAYMENT_VOUCHER',
                            referenceId: newPayment.id,
                            companyId
                        }
                    ]
                });

                // Update cash balance (decrement for payment out)
                await tx.chartOfAccounts.update({
                    where: { id: cashAccount.id },
                    data: { currentBalance: { decrement: paymentAmount } }
                });
            }

            return newPayment;
        });

        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment voucher:', error);
        res.status(500).json({ message: 'Failed to create payment voucher' });
    }
};

// Delete payment voucher (void)
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const existing = await prisma.paymentVoucher.findFirst({
            where: { id: parseInt(id), companyId },
            include: { invoice: true }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Payment voucher not found' });
        }

        // Reverse the payment in transaction
        await prisma.$transaction(async (tx) => {
            // Update invoice amounts
            const invoice = existing.invoice;
            const newPaidAmount = invoice.paidAmount - existing.amount;
            const newDueAmount = invoice.totalAmount - newPaidAmount;

            let newStatus = 'RECEIVED';
            if (newDueAmount <= 0) {
                newStatus = 'PAID';
            } else if (newPaidAmount > 0) {
                newStatus = 'PARTIALLY_PAID';
            }

            await tx.purchaseInvoice.update({
                where: { id: invoice.id },
                data: {
                    paidAmount: newPaidAmount,
                    dueAmount: newDueAmount,
                    status: newStatus
                }
            });

            // Restore vendor balance
            await tx.vendor.update({
                where: { id: existing.vendorId },
                data: {
                    currentBalance: { increment: existing.amount }
                }
            });

            // Delete the payment
            await tx.paymentVoucher.delete({
                where: { id: parseInt(id) }
            });
        });

        res.json({ message: 'Payment voucher deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment voucher:', error);
        res.status(500).json({ message: 'Failed to delete payment voucher' });
    }
};

// Get invoices with balance for payment selection
const getInvoicesForPayment = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { vendorId } = req.query;

        const where = {
            companyId,
            dueAmount: { gt: 0 },
            status: { in: ['RECEIVED', 'PARTIALLY_PAID', 'OVERDUE'] }
        };
        if (vendorId) where.vendorId = parseInt(vendorId);

        const invoices = await prisma.purchaseInvoice.findMany({
            where,
            select: {
                id: true,
                invoiceNumber: true,
                vendorInvoiceNo: true,
                invoiceDate: true,
                dueDate: true,
                totalAmount: true,
                paidAmount: true,
                dueAmount: true,
                vendor: { select: { id: true, name: true } }
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
