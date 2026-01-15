const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products for a company
const getProducts = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const products = await prisma.product.findMany({
            where: { companyId },
            include: {
                category: { select: { id: true, name: true } },
                unit: { select: { id: true, name: true } },
                productStock: {
                    include: {
                        warehouse: { select: { id: true, name: true } }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Calculate total quantity across all warehouses
        const result = products.map(p => ({
            ...p,
            totalQuantity: p.productStock.reduce((sum, ps) => sum + ps.quantity, 0)
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const product = await prisma.product.findFirst({
            where: { id: parseInt(id), companyId },
            include: {
                category: true,
                unit: true,
                productStock: {
                    include: {
                        warehouse: true
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {
            name,
            sku,
            hsn,
            barcode,
            image,
            description,
            remarks,
            categoryId,
            unitId,
            salePrice,
            purchasePrice,
            taxPercent,
            discountPercent,
            asOfDate,
            productType,
            warehouseStock // Array of { warehouseId, quantity, minOrderQty, initialQty }
        } = req.body;

        if (!name || !sku) {
            return res.status(400).json({ message: 'Product name and SKU are required' });
        }

        // Check for duplicate SKU
        const existingSku = await prisma.product.findFirst({
            where: { sku, companyId }
        });
        if (existingSku) {
            return res.status(400).json({ message: 'Product with this SKU already exists' });
        }

        // Create product with stock in transaction
        const product = await prisma.$transaction(async (tx) => {
            // Create the product
            const newProduct = await tx.product.create({
                data: {
                    name,
                    sku,
                    hsn,
                    barcode,
                    image,
                    description,
                    remarks,
                    categoryId: categoryId ? parseInt(categoryId) : null,
                    unitId: unitId ? parseInt(unitId) : null,
                    salePrice: parseFloat(salePrice) || 0,
                    purchasePrice: parseFloat(purchasePrice) || 0,
                    taxPercent: parseFloat(taxPercent) || 0,
                    discountPercent: parseFloat(discountPercent) || 0,
                    asOfDate: asOfDate ? new Date(asOfDate) : null,
                    productType: productType || 'PRODUCT',
                    companyId
                }
            });

            // Create warehouse stock entries if provided
            if (warehouseStock && warehouseStock.length > 0) {
                await tx.productStock.createMany({
                    data: warehouseStock.map(ws => ({
                        productId: newProduct.id,
                        warehouseId: parseInt(ws.warehouseId),
                        quantity: parseFloat(ws.quantity) || 0,
                        minOrderQty: parseFloat(ws.minOrderQty) || 0,
                        initialQty: parseFloat(ws.initialQty) || 0
                    }))
                });
            }

            return newProduct;
        });

        // Fetch the created product with relations
        const createdProduct = await prisma.product.findUnique({
            where: { id: product.id },
            include: {
                category: true,
                unit: true,
                productStock: {
                    include: { warehouse: true }
                }
            }
        });

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        const {
            name,
            sku,
            hsn,
            barcode,
            image,
            description,
            remarks,
            categoryId,
            unitId,
            salePrice,
            purchasePrice,
            taxPercent,
            discountPercent,
            asOfDate,
            productType,
            isActive,
            warehouseStock
        } = req.body;

        // Verify ownership
        const existing = await prisma.product.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check for duplicate SKU
        if (sku && sku !== existing.sku) {
            const duplicate = await prisma.product.findFirst({
                where: { sku, companyId, NOT: { id: parseInt(id) } }
            });
            if (duplicate) {
                return res.status(400).json({ message: 'Product with this SKU already exists' });
            }
        }

        // Update product with stock in transaction
        await prisma.$transaction(async (tx) => {
            // Update the product
            await tx.product.update({
                where: { id: parseInt(id) },
                data: {
                    name: name || existing.name,
                    sku: sku || existing.sku,
                    hsn: hsn !== undefined ? hsn : existing.hsn,
                    barcode: barcode !== undefined ? barcode : existing.barcode,
                    image: image !== undefined ? image : existing.image,
                    description: description !== undefined ? description : existing.description,
                    remarks: remarks !== undefined ? remarks : existing.remarks,
                    categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : existing.categoryId,
                    unitId: unitId !== undefined ? (unitId ? parseInt(unitId) : null) : existing.unitId,
                    salePrice: salePrice !== undefined ? parseFloat(salePrice) : existing.salePrice,
                    purchasePrice: purchasePrice !== undefined ? parseFloat(purchasePrice) : existing.purchasePrice,
                    taxPercent: taxPercent !== undefined ? parseFloat(taxPercent) : existing.taxPercent,
                    discountPercent: discountPercent !== undefined ? parseFloat(discountPercent) : existing.discountPercent,
                    asOfDate: asOfDate !== undefined ? (asOfDate ? new Date(asOfDate) : null) : existing.asOfDate,
                    productType: productType || existing.productType,
                    isActive: isActive !== undefined ? isActive : existing.isActive
                }
            });

            // Update warehouse stock if provided
            if (warehouseStock && warehouseStock.length > 0) {
                for (const ws of warehouseStock) {
                    await tx.productStock.upsert({
                        where: {
                            productId_warehouseId: {
                                productId: parseInt(id),
                                warehouseId: parseInt(ws.warehouseId)
                            }
                        },
                        update: {
                            quantity: parseFloat(ws.quantity) || 0,
                            minOrderQty: parseFloat(ws.minOrderQty) || 0,
                            initialQty: parseFloat(ws.initialQty) || 0
                        },
                        create: {
                            productId: parseInt(id),
                            warehouseId: parseInt(ws.warehouseId),
                            quantity: parseFloat(ws.quantity) || 0,
                            minOrderQty: parseFloat(ws.minOrderQty) || 0,
                            initialQty: parseFloat(ws.initialQty) || 0
                        }
                    });
                }
            }
        });

        // Fetch the updated product
        const updatedProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                unit: true,
                productStock: {
                    include: { warehouse: true }
                }
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        // Verify ownership
        const existing = await prisma.product.findFirst({
            where: { id: parseInt(id), companyId }
        });
        if (!existing) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete product (stock will be cascade deleted)
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

// Update stock for a product-warehouse combination
const updateStock = async (req, res) => {
    try {
        const { productId, warehouseId } = req.params;
        const companyId = req.user.companyId;
        const { quantity, adjustment } = req.body;

        // Verify product ownership
        const product = await prisma.product.findFirst({
            where: { id: parseInt(productId), companyId }
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify warehouse ownership
        const warehouse = await prisma.warehouse.findFirst({
            where: { id: parseInt(warehouseId), companyId }
        });
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        let newQuantity;
        if (adjustment !== undefined) {
            // Adjust stock by amount
            const currentStock = await prisma.productStock.findUnique({
                where: {
                    productId_warehouseId: {
                        productId: parseInt(productId),
                        warehouseId: parseInt(warehouseId)
                    }
                }
            });
            newQuantity = (currentStock?.quantity || 0) + parseFloat(adjustment);
        } else if (quantity !== undefined) {
            // Set absolute quantity
            newQuantity = parseFloat(quantity);
        } else {
            return res.status(400).json({ message: 'Either quantity or adjustment is required' });
        }

        if (newQuantity < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        const stock = await prisma.productStock.upsert({
            where: {
                productId_warehouseId: {
                    productId: parseInt(productId),
                    warehouseId: parseInt(warehouseId)
                }
            },
            update: { quantity: newQuantity },
            create: {
                productId: parseInt(productId),
                warehouseId: parseInt(warehouseId),
                quantity: newQuantity
            },
            include: {
                product: { select: { id: true, name: true, sku: true } },
                warehouse: { select: { id: true, name: true } }
            }
        });

        res.json(stock);
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Failed to update stock' });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
};
