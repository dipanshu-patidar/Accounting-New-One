const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Default Chart of Accounts template
const DEFAULT_ACCOUNTS = [
    // ASSETS
    { code: '1000', name: 'Assets', accountGroup: 'ASSET', accountType: 'Asset', isSystemAccount: true },
    { code: '1060', name: 'Checking Account', accountGroup: 'ASSET', accountType: 'Current Asset', isSystemAccount: true },
    { code: '1065', name: 'Petty Cash', accountGroup: 'ASSET', accountType: 'Current Asset', isSystemAccount: true },
    { code: '1200', name: 'Accounts Receivable', accountGroup: 'ASSET', accountType: 'Current Asset', isSystemAccount: true },
    { code: '1205', name: 'Allowance for Doubtful Accounts', accountGroup: 'ASSET', accountType: 'Current Asset', isSystemAccount: false },
    { code: '1510', name: 'Inventory', accountGroup: 'ASSET', accountType: 'Inventory Asset', isSystemAccount: true },
    { code: '1520', name: 'Stock of Raw Materials', accountGroup: 'ASSET', accountType: 'Inventory Asset', isSystemAccount: false },
    { code: '1530', name: 'Stock of Work In Progress', accountGroup: 'ASSET', accountType: 'Inventory Asset', isSystemAccount: false },
    { code: '1540', name: 'Stock of Finished Goods', accountGroup: 'ASSET', accountType: 'Inventory Asset', isSystemAccount: false },
    { code: '1550', name: 'Goods Received Clearing Account', accountGroup: 'ASSET', accountType: 'Inventory Asset', isSystemAccount: false },
    { code: '1700', name: 'Fixed Assets', accountGroup: 'ASSET', accountType: 'Non-current Asset', isSystemAccount: false },
    { code: '1800', name: 'Accumulated Depreciation', accountGroup: 'ASSET', accountType: 'Non-current Asset', isSystemAccount: false },

    // LIABILITIES
    { code: '2000', name: 'Liabilities', accountGroup: 'LIABILITY', accountType: 'Liability', isSystemAccount: true },
    { code: '2100', name: 'Accounts Payable', accountGroup: 'LIABILITY', accountType: 'Current Liability', isSystemAccount: true },
    { code: '2150', name: 'Tax Payable', accountGroup: 'LIABILITY', accountType: 'Current Liability', isSystemAccount: true },
    { code: '2160', name: 'GST Payable', accountGroup: 'LIABILITY', accountType: 'Current Liability', isSystemAccount: false },
    { code: '2170', name: 'VAT Payable', accountGroup: 'LIABILITY', accountType: 'Current Liability', isSystemAccount: false },
    { code: '2200', name: 'Salary Payable', accountGroup: 'LIABILITY', accountType: 'Current Liability', isSystemAccount: false },
    { code: '2500', name: 'Long Term Loans', accountGroup: 'LIABILITY', accountType: 'Long Term Liability', isSystemAccount: false },

    // EQUITY
    { code: '3000', name: 'Equity', accountGroup: 'EQUITY', accountType: 'Equity', isSystemAccount: true },
    { code: '3100', name: 'Owner\'s Equity', accountGroup: 'EQUITY', accountType: 'Owners Equity', isSystemAccount: true },
    { code: '3200', name: 'Retained Earnings', accountGroup: 'EQUITY', accountType: 'Retained Earnings', isSystemAccount: true },
    { code: '3300', name: 'Share Capital', accountGroup: 'EQUITY', accountType: 'Share Capital', isSystemAccount: false },

    // INCOME
    { code: '4000', name: 'Income', accountGroup: 'INCOME', accountType: 'Income', isSystemAccount: true },
    { code: '4100', name: 'Sales Revenue', accountGroup: 'INCOME', accountType: 'Sales Revenue', isSystemAccount: true },
    { code: '4200', name: 'Service Revenue', accountGroup: 'INCOME', accountType: 'Sales Revenue', isSystemAccount: false },
    { code: '4300', name: 'Interest Income', accountGroup: 'INCOME', accountType: 'Other Revenue', isSystemAccount: false },
    { code: '4400', name: 'Other Income', accountGroup: 'INCOME', accountType: 'Other Revenue', isSystemAccount: false },

    // EXPENSES
    { code: '5000', name: 'Expenses', accountGroup: 'EXPENSE', accountType: 'Expense', isSystemAccount: true },
    { code: '5100', name: 'Cost of Goods Sold', accountGroup: 'EXPENSE', accountType: 'Costs of Goods Sold', isSystemAccount: true },
    { code: '5200', name: 'Purchase Account', accountGroup: 'EXPENSE', accountType: 'Costs of Goods Sold', isSystemAccount: true },
    { code: '5300', name: 'Purchase Returns', accountGroup: 'EXPENSE', accountType: 'Costs of Goods Sold', isSystemAccount: false },
    { code: '6000', name: 'Operating Expenses', accountGroup: 'EXPENSE', accountType: 'General and Administrative expenses', isSystemAccount: false },
    { code: '6100', name: 'Salary Expense', accountGroup: 'EXPENSE', accountType: 'Payroll Expenses', isSystemAccount: false },
    { code: '6200', name: 'Rent Expense', accountGroup: 'EXPENSE', accountType: 'General and Administrative expenses', isSystemAccount: false },
    { code: '6300', name: 'Utilities Expense', accountGroup: 'EXPENSE', accountType: 'General and Administrative expenses', isSystemAccount: false },
    { code: '6400', name: 'Office Supplies', accountGroup: 'EXPENSE', accountType: 'General and Administrative expenses', isSystemAccount: false },
    { code: '6500', name: 'Depreciation Expense', accountGroup: 'EXPENSE', accountType: 'General and Administrative expenses', isSystemAccount: false },
    { code: '6600', name: 'Bank Charges', accountGroup: 'EXPENSE', accountType: 'General and Administrative expenses', isSystemAccount: false },
    { code: '6700', name: 'Interest Expense', accountGroup: 'EXPENSE', accountType: 'General and Administrative expenses', isSystemAccount: false },
];

// Create default COA for a company
const createDefaultCOA = async (companyId, tx = prisma) => {
    const accounts = DEFAULT_ACCOUNTS.map(account => ({
        ...account,
        companyId
    }));

    await tx.chartOfAccounts.createMany({
        data: accounts,
        skipDuplicates: true
    });
};

// Create a new account
const createAccount = async (req, res) => {
    try {
        const { code, name, accountGroup, accountType, description, parentId, isEnabled, openingBalance } = req.body;
        const companyId = req.user.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        // Check if code already exists for this company
        const existingAccount = await prisma.chartOfAccounts.findFirst({
            where: { code, companyId }
        });

        if (existingAccount) {
            return res.status(400).json({ error: 'Account code already exists for this company' });
        }

        const account = await prisma.chartOfAccounts.create({
            data: {
                code,
                name,
                accountGroup,
                accountType,
                description,
                parentId: parentId ? parseInt(parentId) : null,
                isEnabled: isEnabled !== undefined ? isEnabled : true,
                openingBalance: openingBalance ? parseFloat(openingBalance) : 0,
                currentBalance: openingBalance ? parseFloat(openingBalance) : 0,
                companyId
            },
            include: {
                parent: true,
                children: true
            }
        });

        res.status(201).json(account);
    } catch (error) {
        console.error('Create Account Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Get all accounts for a company
const getAccounts = async (req, res) => {
    try {
        const companyId = req.query.company_id ? parseInt(req.query.company_id) : req.user?.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const accounts = await prisma.chartOfAccounts.findMany({
            where: { companyId },
            include: {
                parent: {
                    select: { id: true, name: true, code: true }
                },
                children: {
                    select: { id: true, name: true, code: true }
                }
            },
            orderBy: [
                { accountGroup: 'asc' },
                { code: 'asc' }
            ]
        });

        // Group accounts by accountGroup for frontend
        const groupedAccounts = {
            ASSET: accounts.filter(a => a.accountGroup === 'ASSET'),
            LIABILITY: accounts.filter(a => a.accountGroup === 'LIABILITY'),
            EQUITY: accounts.filter(a => a.accountGroup === 'EQUITY'),
            INCOME: accounts.filter(a => a.accountGroup === 'INCOME'),
            EXPENSE: accounts.filter(a => a.accountGroup === 'EXPENSE')
        };

        res.json({ accounts, groupedAccounts });
    } catch (error) {
        console.error('Get Accounts Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get single account by ID
const getAccountById = async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const companyId = req.user?.companyId;

        const account = await prisma.chartOfAccounts.findFirst({
            where: {
                id: accountId,
                ...(companyId && { companyId })
            },
            include: {
                parent: true,
                children: true,
                ledgerEntries: {
                    orderBy: { date: 'desc' },
                    take: 50
                }
            }
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.json(account);
    } catch (error) {
        console.error('Get Account By ID Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update an account
const updateAccount = async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const { name, code, accountType, description, parentId, isEnabled } = req.body;
        const companyId = req.user?.companyId;

        // Check if account exists and belongs to company
        const existingAccount = await prisma.chartOfAccounts.findFirst({
            where: {
                id: accountId,
                ...(companyId && { companyId })
            }
        });

        if (!existingAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // If changing code, check for duplicates
        if (code && code !== existingAccount.code) {
            const duplicateCode = await prisma.chartOfAccounts.findFirst({
                where: {
                    code,
                    companyId: existingAccount.companyId,
                    NOT: { id: accountId }
                }
            });
            if (duplicateCode) {
                return res.status(400).json({ error: 'Account code already exists' });
            }
        }

        const account = await prisma.chartOfAccounts.update({
            where: { id: accountId },
            data: {
                ...(name && { name }),
                ...(code && { code }),
                ...(accountType && { accountType }),
                ...(description !== undefined && { description }),
                ...(parentId !== undefined && { parentId: parentId ? parseInt(parentId) : null }),
                ...(isEnabled !== undefined && { isEnabled })
            },
            include: {
                parent: true,
                children: true
            }
        });

        res.json(account);
    } catch (error) {
        console.error('Update Account Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Delete an account
const deleteAccount = async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const companyId = req.user?.companyId;

        // Check if account exists
        const account = await prisma.chartOfAccounts.findFirst({
            where: {
                id: accountId,
                ...(companyId && { companyId })
            },
            include: {
                children: true,
                ledgerEntries: true
            }
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Prevent deletion of system accounts
        if (account.isSystemAccount) {
            return res.status(400).json({ error: 'Cannot delete system account' });
        }

        // Prevent deletion if account has children
        if (account.children.length > 0) {
            return res.status(400).json({ error: 'Cannot delete account with sub-accounts. Delete sub-accounts first.' });
        }

        // Prevent deletion if account has ledger entries
        if (account.ledgerEntries.length > 0) {
            return res.status(400).json({ error: 'Cannot delete account with transactions. Mark as disabled instead.' });
        }

        await prisma.chartOfAccounts.delete({
            where: { id: accountId }
        });

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Initialize COA for a company (called when company is created)
const initializeCOA = async (req, res) => {
    try {
        const companyId = req.body.companyId || req.user?.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        // Check if COA already exists
        const existingAccounts = await prisma.chartOfAccounts.count({
            where: { companyId }
        });

        if (existingAccounts > 0) {
            return res.status(400).json({ error: 'Chart of Accounts already initialized for this company' });
        }

        await createDefaultCOA(companyId);

        const accounts = await prisma.chartOfAccounts.findMany({
            where: { companyId },
            orderBy: { code: 'asc' }
        });

        res.status(201).json({
            message: 'Chart of Accounts initialized successfully',
            count: accounts.length,
            accounts
        });
    } catch (error) {
        console.error('Initialize COA Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Get account types for dropdown
const getAccountTypes = async (req, res) => {
    try {
        const accountTypes = {
            ASSET: [
                { value: 'Current Asset', label: 'Current Asset' },
                { value: 'Inventory Asset', label: 'Inventory Asset' },
                { value: 'Non-current Asset', label: 'Non-current Asset' }
            ],
            LIABILITY: [
                { value: 'Current Liability', label: 'Current Liability' },
                { value: 'Long Term Liability', label: 'Long Term Liability' },
                { value: 'Share Capital', label: 'Share Capital' },
                { value: 'Retained Earnings', label: 'Retained Earnings' }
            ],
            EQUITY: [
                { value: 'Owners Equity', label: 'Owners Equity' }
            ],
            INCOME: [
                { value: 'Sales Revenue', label: 'Sales Revenue' },
                { value: 'Other Revenue', label: 'Other Revenue' }
            ],
            EXPENSE: [
                { value: 'Costs of Goods Sold', label: 'Costs of Goods Sold' },
                { value: 'Payroll Expenses', label: 'Payroll Expenses' },
                { value: 'General and Administrative expenses', label: 'General and Administrative Expenses' }
            ]
        };

        res.json(accountTypes);
    } catch (error) {
        console.error('Get Account Types Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    initializeCOA,
    getAccountTypes,
    createDefaultCOA
};
