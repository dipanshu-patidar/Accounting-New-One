const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create ledger entry (Journal Entry)
const createLedgerEntry = async (req, res) => {
    try {
        const { entries, date, narration, voucherNumber, referenceType, referenceId } = req.body;
        const companyId = req.user.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        if (!entries || entries.length < 2) {
            return res.status(400).json({ error: 'At least two entries (debit and credit) are required' });
        }

        // Validate that debits equal credits
        let totalDebit = 0;
        let totalCredit = 0;

        entries.forEach(entry => {
            if (entry.entryType === 'DEBIT') {
                totalDebit += parseFloat(entry.amount);
            } else {
                totalCredit += parseFloat(entry.amount);
            }
        });

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            return res.status(400).json({
                error: 'Total debits must equal total credits',
                totalDebit,
                totalCredit
            });
        }

        // Create entries in transaction
        const result = await prisma.$transaction(async (tx) => {
            const createdEntries = [];

            for (const entry of entries) {
                // Verify account exists and belongs to company
                const account = await tx.chartOfAccounts.findFirst({
                    where: {
                        id: parseInt(entry.accountId),
                        companyId
                    }
                });

                if (!account) {
                    throw new Error(`Account ${entry.accountId} not found`);
                }

                // Create ledger entry
                const ledgerEntry = await tx.ledgerEntry.create({
                    data: {
                        date: date ? new Date(date) : new Date(),
                        accountId: parseInt(entry.accountId),
                        entryType: entry.entryType,
                        amount: parseFloat(entry.amount),
                        narration: entry.narration || narration,
                        voucherNumber,
                        referenceType,
                        referenceId: referenceId ? parseInt(referenceId) : null,
                        companyId
                    }
                });

                // Update account balance
                const balanceChange = entry.entryType === 'DEBIT'
                    ? parseFloat(entry.amount)
                    : -parseFloat(entry.amount);

                // For ASSET and EXPENSE, debit increases balance
                // For LIABILITY, EQUITY, INCOME, credit increases balance
                let actualChange = balanceChange;
                if (['LIABILITY', 'EQUITY', 'INCOME'].includes(account.accountGroup)) {
                    actualChange = -balanceChange;
                }

                await tx.chartOfAccounts.update({
                    where: { id: account.id },
                    data: {
                        currentBalance: { increment: actualChange }
                    }
                });

                createdEntries.push(ledgerEntry);
            }

            return createdEntries;
        });

        res.status(201).json({
            message: 'Ledger entries created successfully',
            entries: result
        });
    } catch (error) {
        console.error('Create Ledger Entry Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Get ledger entries
const getLedgerEntries = async (req, res) => {
    try {
        const companyId = req.query.company_id ? parseInt(req.query.company_id) : req.user?.companyId;
        const { accountId, startDate, endDate, referenceType } = req.query;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const where = { companyId };

        if (accountId) {
            where.accountId = parseInt(accountId);
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        if (referenceType) {
            where.referenceType = referenceType;
        }

        const entries = await prisma.ledgerEntry.findMany({
            where,
            include: {
                account: {
                    select: { id: true, code: true, name: true, accountGroup: true }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.json(entries);
    } catch (error) {
        console.error('Get Ledger Entries Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get ledger entry by ID
const getLedgerEntryById = async (req, res) => {
    try {
        const entryId = parseInt(req.params.id);
        const companyId = req.user?.companyId;

        const entry = await prisma.ledgerEntry.findFirst({
            where: {
                id: entryId,
                ...(companyId && { companyId })
            },
            include: {
                account: true
            }
        });

        if (!entry) {
            return res.status(404).json({ message: 'Ledger entry not found' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Get Ledger Entry By ID Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get account ledger (all entries for an account with running balance)
const getAccountLedger = async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const companyId = req.user?.companyId;
        const { startDate, endDate } = req.query;

        // Get account details
        const account = await prisma.chartOfAccounts.findFirst({
            where: {
                id: accountId,
                ...(companyId && { companyId })
            }
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const where = { accountId };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const entries = await prisma.ledgerEntry.findMany({
            where,
            orderBy: { date: 'asc' }
        });

        // Calculate running balance
        let runningBalance = account.openingBalance;
        const entriesWithBalance = entries.map(entry => {
            const change = entry.entryType === 'DEBIT' ? entry.amount : -entry.amount;

            // Adjust for account type
            let actualChange = change;
            if (['LIABILITY', 'EQUITY', 'INCOME'].includes(account.accountGroup)) {
                actualChange = -change;
            }

            runningBalance += actualChange;

            return {
                ...entry,
                runningBalance
            };
        });

        res.json({
            account,
            openingBalance: account.openingBalance,
            closingBalance: runningBalance,
            entries: entriesWithBalance
        });
    } catch (error) {
        console.error('Get Account Ledger Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Generate next voucher number
const getNextVoucherNumber = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        const { type } = req.query; // JV, RV, PV, etc.

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const prefix = type || 'JV';
        const year = new Date().getFullYear();

        // Find last voucher of this type
        const lastEntry = await prisma.ledgerEntry.findFirst({
            where: {
                companyId,
                voucherNumber: { startsWith: `${prefix}-${year}` }
            },
            orderBy: { createdAt: 'desc' }
        });

        let nextNumber = 1;
        if (lastEntry && lastEntry.voucherNumber) {
            const parts = lastEntry.voucherNumber.split('-');
            if (parts.length === 3) {
                nextNumber = parseInt(parts[2]) + 1;
            }
        }

        const voucherNumber = `${prefix}-${year}-${String(nextNumber).padStart(5, '0')}`;

        res.json({ voucherNumber });
    } catch (error) {
        console.error('Get Next Voucher Number Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createLedgerEntry,
    getLedgerEntries,
    getLedgerEntryById,
    getAccountLedger,
    getNextVoucherNumber
};
