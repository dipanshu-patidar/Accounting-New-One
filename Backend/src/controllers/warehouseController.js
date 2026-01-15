const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all warehouses for a company
const getWarehouses = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const warehouses = await prisma.warehouse.findMany({
            where: { companyId },
            include: {
                productStock: {
                    select: {
                        quantity: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Add total stocks count
        const result = warehouses.map(wh => ({
            ...wh,
            totalStocks: wh.productStock.reduce((sum, ps) => sum + ps.quantity, 0),
            productStock: undefined
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        res.status(500).json({ message: 'Failed to fetch warehouses' });
    }
};

// Get single warehouse
const getWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const warehouse = await prisma.warehouse.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                productStock: {
                    include: {
                        product: {
                            select: { id: true, name: true, sku: true }
                        }
                    }
                }
            }
        });

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        res.json(warehouse);
    } catch (error) {
        console.error('Error fetching warehouse:', error);
        res.status(500).json({ message: 'Failed to fetch warehouse' });
    }
};

// Create warehouse
const createWarehouse = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { name, location, address1, address2, city, state, pincode, country } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Warehouse name is required' });
        }

        // Check for duplicate
        const existing = await prisma.warehouse.findFirst({
            where: { name, companyId }
        });
        if (existing) {
            return res.status(400).json({ message: 'Warehouse with this name already exists' });
        }

        const warehouse = await prisma.warehouse.create({
            data: {
                name,
                location,
                address1,
                address2,
                city,
                state,
                pincode,
                country,
                companyId
            }
        });

        res.status(201).json(warehouse);
    } catch (error) {
        console.error('Error creating warehouse:', error);
        res.status(500).json({ message: 'Failed to create warehouse' });
    }
};

// Update warehouse
const updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const { name, location, address1, address2, city, state, pincode, country, isActive } = req.body;

        // Verify ownership
        const existing = await prisma.warehouse.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        // Check for duplicate name
        if (name && name !== existing.name) {
            const duplicate = await prisma.warehouse.findFirst({
                where: { name, companyId, NOT: { id: parseInt(id) } }
            });
            if (duplicate) {
                return res.status(400).json({ message: 'Warehouse with this name already exists' });
            }
        }

        const warehouse = await prisma.warehouse.update({
            where: { id: parseInt(id) },
            data: {
                name: name || existing.name,
                location: location !== undefined ? location : existing.location,
                address1: address1 !== undefined ? address1 : existing.address1,
                address2: address2 !== undefined ? address2 : existing.address2,
                city: city !== undefined ? city : existing.city,
                state: state !== undefined ? state : existing.state,
                pincode: pincode !== undefined ? pincode : existing.pincode,
                country: country !== undefined ? country : existing.country,
                isActive: isActive !== undefined ? isActive : existing.isActive
            }
        });

        res.json(warehouse);
    } catch (error) {
        console.error('Error updating warehouse:', error);
        res.status(500).json({ message: 'Failed to update warehouse' });
    }
};

// Delete warehouse
const deleteWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        // Verify ownership
        const existing = await prisma.warehouse.findFirst({
            where: { id: parseInt(id), companyId },
            include: { _count: { select: { productStock: true } } }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        // Check if warehouse has stock
        if (existing._count.productStock > 0) {
            return res.status(400).json({
                message: `Cannot delete warehouse with ${existing._count.productStock} stock entries. Transfer stock first.`
            });
        }

        await prisma.warehouse.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Warehouse deleted successfully' });
    } catch (error) {
        console.error('Error deleting warehouse:', error);
        res.status(500).json({ message: 'Failed to delete warehouse' });
    }
};

// Create default warehouse for a company
const createDefaultWarehouse = async (companyId, companyName, tx = prisma) => {
    await tx.warehouse.create({
        data: {
            name: 'Main Warehouse',
            location: `${companyName} - Main`,
            companyId
        }
    });
};

module.exports = {
    getWarehouses,
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    createDefaultWarehouse
};
