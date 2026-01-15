const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all units of measure for a company
const getUnits = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const units = await prisma.unitOfMeasure.findMany({
            where: { companyId },
            orderBy: { name: 'asc' }
        });

        res.json(units);
    } catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({ message: 'Failed to fetch units' });
    }
};

// Get single unit
const getUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const unit = await prisma.unitOfMeasure.findFirst({
            where: { id: parseInt(id), companyId }
        });

        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        res.json(unit);
    } catch (error) {
        console.error('Error fetching unit:', error);
        res.status(500).json({ message: 'Failed to fetch unit' });
    }
};

// Create unit
const createUnit = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { name, category, weightPerUnit } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: 'Unit name and category are required' });
        }

        // Check for duplicate
        const existing = await prisma.unitOfMeasure.findFirst({
            where: { name, companyId }
        });
        if (existing) {
            return res.status(400).json({ message: 'Unit with this name already exists' });
        }

        const unit = await prisma.unitOfMeasure.create({
            data: {
                name,
                category,
                weightPerUnit,
                companyId
            }
        });

        res.status(201).json(unit);
    } catch (error) {
        console.error('Error creating unit:', error);
        res.status(500).json({ message: 'Failed to create unit' });
    }
};

// Update unit
const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const { name, category, weightPerUnit, isActive } = req.body;

        // Verify ownership
        const existing = await prisma.unitOfMeasure.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        // Check for duplicate name
        if (name && name !== existing.name) {
            const duplicate = await prisma.unitOfMeasure.findFirst({
                where: { name, companyId, NOT: { id: parseInt(id) } }
            });
            if (duplicate) {
                return res.status(400).json({ message: 'Unit with this name already exists' });
            }
        }

        const unit = await prisma.unitOfMeasure.update({
            where: { id: parseInt(id) },
            data: {
                name: name || existing.name,
                category: category || existing.category,
                weightPerUnit: weightPerUnit !== undefined ? weightPerUnit : existing.weightPerUnit,
                isActive: isActive !== undefined ? isActive : existing.isActive
            }
        });

        res.json(unit);
    } catch (error) {
        console.error('Error updating unit:', error);
        res.status(500).json({ message: 'Failed to update unit' });
    }
};

// Delete unit
const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        // Verify ownership
        const existing = await prisma.unitOfMeasure.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        // Check if unit is used by products or services
        const productCount = await prisma.product.count({
            where: { unitId: parseInt(id) }
        });
        const serviceCount = await prisma.service.count({
            where: { unitId: parseInt(id) }
        });

        if (productCount > 0 || serviceCount > 0) {
            return res.status(400).json({
                message: `Cannot delete unit used by ${productCount} products and ${serviceCount} services.`
            });
        }

        await prisma.unitOfMeasure.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Unit deleted successfully' });
    } catch (error) {
        console.error('Error deleting unit:', error);
        res.status(500).json({ message: 'Failed to delete unit' });
    }
};

// Create default units of measure for a company
const createDefaultUnits = async (companyId, tx = prisma) => {
    const defaultUnits = [
        { name: 'Kilogram', category: 'Weight', weightPerUnit: '1 KG' },
        { name: 'Gram', category: 'Weight', weightPerUnit: '0.001 KG' },
        { name: 'Litre', category: 'Volume', weightPerUnit: '1 LTR' },
        { name: 'Millilitre', category: 'Volume', weightPerUnit: '0.001 LTR' },
        { name: 'Meter', category: 'Length', weightPerUnit: '1 MTR' },
        { name: 'Centimeter', category: 'Length', weightPerUnit: '0.01 MTR' },
        { name: 'Inch', category: 'Length', weightPerUnit: '0.0254 MTR' },
        { name: 'Piece', category: 'Count', weightPerUnit: '1 PC' },
        { name: 'Dozen', category: 'Count', weightPerUnit: '12 PC' },
        { name: 'Box', category: 'Count', weightPerUnit: '1 BOX' },
        { name: 'Square Meter', category: 'Area', weightPerUnit: '1 SQM' },
        { name: 'Square Foot', category: 'Area', weightPerUnit: '0.0929 SQM' }
    ];

    await tx.unitOfMeasure.createMany({
        data: defaultUnits.map(unit => ({
            ...unit,
            companyId
        }))
    });
};

module.exports = {
    getUnits,
    getUnit,
    createUnit,
    updateUnit,
    deleteUnit,
    createDefaultUnits
};
