const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all services for a company
const getServices = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const services = await prisma.service.findMany({
            where: { companyId },
            include: {
                unit: { select: { id: true, name: true } }
            },
            orderBy: { name: 'asc' }
        });

        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Failed to fetch services' });
    }
};

// Get single service
const getService = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const service = await prisma.service.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                unit: true
            }
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ message: 'Failed to fetch service' });
    }
};

// Create service
const createService = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {
            name,
            sku,
            description,
            remarks,
            unitId,
            price,
            taxPercent,
            allowInInvoices
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Service name is required' });
        }

        // Check for duplicate name
        const existing = await prisma.service.findFirst({
            where: { name, companyId }
        });
        if (existing) {
            return res.status(400).json({ message: 'Service with this name already exists' });
        }

        const service = await prisma.service.create({
            data: {
                name,
                sku,
                description,
                remarks,
                unitId: unitId ? parseInt(unitId) : null,
                price: parseFloat(price) || 0,
                taxPercent: parseFloat(taxPercent) || 0,
                allowInInvoices: allowInInvoices !== undefined ? allowInInvoices : true,
                companyId
            },
            include: {
                unit: true
            }
        });

        res.status(201).json(service);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Failed to create service' });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const {
            name,
            sku,
            description,
            remarks,
            unitId,
            price,
            taxPercent,
            allowInInvoices,
            isActive
        } = req.body;

        // Verify ownership
        const existing = await prisma.service.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check for duplicate name
        if (name && name !== existing.name) {
            const duplicate = await prisma.service.findFirst({
                where: { name, companyId, NOT: { id: parseInt(id) } }
            });
            if (duplicate) {
                return res.status(400).json({ message: 'Service with this name already exists' });
            }
        }

        const service = await prisma.service.update({
            where: { id: parseInt(id) },
            data: {
                name: name || existing.name,
                sku: sku !== undefined ? sku : existing.sku,
                description: description !== undefined ? description : existing.description,
                remarks: remarks !== undefined ? remarks : existing.remarks,
                unitId: unitId !== undefined ? (unitId ? parseInt(unitId) : null) : existing.unitId,
                price: price !== undefined ? parseFloat(price) : existing.price,
                taxPercent: taxPercent !== undefined ? parseFloat(taxPercent) : existing.taxPercent,
                allowInInvoices: allowInInvoices !== undefined ? allowInInvoices : existing.allowInInvoices,
                isActive: isActive !== undefined ? isActive : existing.isActive
            },
            include: {
                unit: true
            }
        });

        res.json(service);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Failed to update service' });
    }
};

// Delete service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        // Verify ownership
        const existing = await prisma.service.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await prisma.service.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Failed to delete service' });
    }
};

module.exports = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
};
