const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new vendor
const createVendor = async (req, res) => {
    try {
        const { name, email, phone, address, gstNumber, creditLimit, creditDays, openingBalance } = req.body;
        const companyId = req.user.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        // Create vendor with linked AP sub-ledger
        const result = await prisma.$transaction(async (tx) => {
            // Find Accounts Payable parent account
            const apAccount = await tx.chartOfAccounts.findFirst({
                where: { companyId, code: '2100' }
            });

            // Create sub-ledger for this vendor
            let ledgerAccount = null;
            if (apAccount) {
                const vendorCode = `2100-${Date.now()}`;
                ledgerAccount = await tx.chartOfAccounts.create({
                    data: {
                        code: vendorCode,
                        name: `AP - ${name}`,
                        accountGroup: 'LIABILITY',
                        accountType: 'Current Liability',
                        parentId: apAccount.id,
                        openingBalance: openingBalance ? parseFloat(openingBalance) : 0,
                        currentBalance: openingBalance ? parseFloat(openingBalance) : 0,
                        companyId,
                        description: `Accounts Payable for ${name}`
                    }
                });
            }

            // Create vendor
            const vendor = await tx.vendor.create({
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

            return vendor;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Create Vendor Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Get all vendors
const getVendors = async (req, res) => {
    try {
        const companyId = req.query.company_id ? parseInt(req.query.company_id) : req.user?.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const vendors = await prisma.vendor.findMany({
            where: { companyId },
            orderBy: { name: 'asc' }
        });

        res.json(vendors);
    } catch (error) {
        console.error('Get Vendors Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get single vendor
const getVendorById = async (req, res) => {
    try {
        const vendorId = parseInt(req.params.id);
        const companyId = req.user?.companyId;

        const vendor = await prisma.vendor.findFirst({
            where: {
                id: vendorId,
                ...(companyId && { companyId })
            }
        });

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Get ledger entries if linked
        let ledgerEntries = [];
        if (vendor.ledgerAccountId) {
            ledgerEntries = await prisma.ledgerEntry.findMany({
                where: { accountId: vendor.ledgerAccountId },
                orderBy: { date: 'desc' },
                take: 50
            });
        }

        res.json({ ...vendor, ledgerEntries });
    } catch (error) {
        console.error('Get Vendor By ID Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update vendor
const updateVendor = async (req, res) => {
    try {
        const vendorId = parseInt(req.params.id);
        const { name, email, phone, address, gstNumber, creditLimit, creditDays, isActive } = req.body;
        const companyId = req.user?.companyId;

        const existingVendor = await prisma.vendor.findFirst({
            where: {
                id: vendorId,
                ...(companyId && { companyId })
            }
        });

        if (!existingVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const vendor = await prisma.vendor.update({
            where: { id: vendorId },
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
        if (vendor.ledgerAccountId && name) {
            await prisma.chartOfAccounts.update({
                where: { id: vendor.ledgerAccountId },
                data: { name: `AP - ${name}` }
            });
        }

        res.json(vendor);
    } catch (error) {
        console.error('Update Vendor Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Delete vendor
const deleteVendor = async (req, res) => {
    try {
        const vendorId = parseInt(req.params.id);
        const companyId = req.user?.companyId;

        const vendor = await prisma.vendor.findFirst({
            where: {
                id: vendorId,
                ...(companyId && { companyId })
            }
        });

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Check if vendor has transactions
        if (vendor.ledgerAccountId) {
            const entries = await prisma.ledgerEntry.count({
                where: { accountId: vendor.ledgerAccountId }
            });
            if (entries > 0) {
                return res.status(400).json({ error: 'Cannot delete vendor with transactions. Mark as inactive instead.' });
            }
        }

        await prisma.$transaction(async (tx) => {
            // Delete linked ledger account if no entries
            if (vendor.ledgerAccountId) {
                await tx.chartOfAccounts.delete({
                    where: { id: vendor.ledgerAccountId }
                });
            }
            await tx.vendor.delete({
                where: { id: vendorId }
            });
        });

        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error('Delete Vendor Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createVendor,
    getVendors,
    getVendorById,
    updateVendor,
    deleteVendor
};
