const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new customer
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, gstNumber, creditLimit, creditDays, openingBalance } = req.body;
        const companyId = req.user.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        // Create customer with linked AR sub-ledger
        const result = await prisma.$transaction(async (tx) => {
            // Find Accounts Receivable parent account
            const arAccount = await tx.chartOfAccounts.findFirst({
                where: { companyId, code: '1200' }
            });

            // Create sub-ledger for this customer
            let ledgerAccount = null;
            if (arAccount) {
                const customerCode = `1200-${Date.now()}`;
                ledgerAccount = await tx.chartOfAccounts.create({
                    data: {
                        code: customerCode,
                        name: `AR - ${name}`,
                        accountGroup: 'ASSET',
                        accountType: 'Current Asset',
                        parentId: arAccount.id,
                        openingBalance: openingBalance ? parseFloat(openingBalance) : 0,
                        currentBalance: openingBalance ? parseFloat(openingBalance) : 0,
                        companyId,
                        description: `Accounts Receivable for ${name}`
                    }
                });
            }

            // Create customer
            const customer = await tx.customer.create({
                data: {
                    name,
                    email,
                    phone,
                    address,
                    gstNumber,
                    creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
                    creditDays: creditDays ? parseInt(creditDays) : 0,
                    openingBalance: openingBalance ? parseFloat(openingBalance) : 0,
                    currentBalance: openingBalance ? parseFloat(openingBalance) : 0,
                    ledgerAccountId: ledgerAccount?.id,
                    companyId
                }
            });

            return customer;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Create Customer Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Get all customers
const getCustomers = async (req, res) => {
    try {
        const companyId = req.query.company_id ? parseInt(req.query.company_id) : req.user?.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const customers = await prisma.customer.findMany({
            where: { companyId },
            orderBy: { name: 'asc' }
        });

        res.json(customers);
    } catch (error) {
        console.error('Get Customers Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get single customer
const getCustomerById = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const companyId = req.user?.companyId;

        const customer = await prisma.customer.findFirst({
            where: {
                id: customerId,
                ...(companyId && { companyId })
            }
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Get ledger entries if linked
        let ledgerEntries = [];
        if (customer.ledgerAccountId) {
            ledgerEntries = await prisma.ledgerEntry.findMany({
                where: { accountId: customer.ledgerAccountId },
                orderBy: { date: 'desc' },
                take: 50
            });
        }

        res.json({ ...customer, ledgerEntries });
    } catch (error) {
        console.error('Get Customer By ID Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const { name, email, phone, address, gstNumber, creditLimit, creditDays, isActive } = req.body;
        const companyId = req.user?.companyId;

        const existingCustomer = await prisma.customer.findFirst({
            where: {
                id: customerId,
                ...(companyId && { companyId })
            }
        });

        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customer = await prisma.customer.update({
            where: { id: customerId },
            data: {
                ...(name && { name }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone }),
                ...(address !== undefined && { address }),
                ...(gstNumber !== undefined && { gstNumber }),
                ...(creditLimit !== undefined && { creditLimit: parseFloat(creditLimit) }),
                ...(creditDays !== undefined && { creditDays: parseInt(creditDays) }),
                ...(isActive !== undefined && { isActive })
            }
        });

        // Update linked ledger account name if exists
        if (customer.ledgerAccountId && name) {
            await prisma.chartOfAccounts.update({
                where: { id: customer.ledgerAccountId },
                data: { name: `AR - ${name}` }
            });
        }

        res.json(customer);
    } catch (error) {
        console.error('Update Customer Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const companyId = req.user?.companyId;

        const customer = await prisma.customer.findFirst({
            where: {
                id: customerId,
                ...(companyId && { companyId })
            }
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Check if customer has transactions
        if (customer.ledgerAccountId) {
            const entries = await prisma.ledgerEntry.count({
                where: { accountId: customer.ledgerAccountId }
            });
            if (entries > 0) {
                return res.status(400).json({ error: 'Cannot delete customer with transactions. Mark as inactive instead.' });
            }
        }

        await prisma.$transaction(async (tx) => {
            // Delete linked ledger account if no entries
            if (customer.ledgerAccountId) {
                await tx.chartOfAccounts.delete({
                    where: { id: customer.ledgerAccountId }
                });
            }
            await tx.customer.delete({
                where: { id: customerId }
            });
        });

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete Customer Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
