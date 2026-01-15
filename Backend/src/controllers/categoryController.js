const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all categories for a company
const getCategories = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const categories = await prisma.category.findMany({
            where: { companyId },
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};

// Get single category
const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const category = await prisma.category.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                products: {
                    select: { id: true, name: true, sku: true }
                }
            }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Failed to fetch category' });
    }
};

// Create category
const createCategory = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        // Check for duplicate
        const existing = await prisma.category.findFirst({
            where: { name, companyId }
        });
        if (existing) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        const category = await prisma.category.create({
            data: {
                name,
                description,
                companyId
            }
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Failed to create category' });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const { name, description, isActive } = req.body;

        // Verify ownership
        const existing = await prisma.category.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check for duplicate name
        if (name && name !== existing.name) {
            const duplicate = await prisma.category.findFirst({
                where: { name, companyId, NOT: { id: parseInt(id) } }
            });
            if (duplicate) {
                return res.status(400).json({ message: 'Category with this name already exists' });
            }
        }

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                name: name || existing.name,
                description: description !== undefined ? description : existing.description,
                isActive: isActive !== undefined ? isActive : existing.isActive
            }
        });

        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Failed to update category' });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        // Verify ownership
        const existing = await prisma.category.findFirst({
            where: { id: parseInt(id), companyId },
            include: { _count: { select: { products: true } } }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category has products
        if (existing._count.products > 0) {
            return res.status(400).json({
                message: `Cannot delete category with ${existing._count.products} products. Remove products first.`
            });
        }

        await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Failed to delete category' });
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
