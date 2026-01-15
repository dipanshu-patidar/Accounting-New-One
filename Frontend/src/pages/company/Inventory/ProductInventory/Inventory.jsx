import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../../../../services/productService';
import categoryService from '../../../../services/categoryService';
import uomService from '../../../../services/uomService';
import warehouseService from '../../../../services/warehouseService';
import './Inventory.css';

const Inventory = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        hsn: '',
        barcode: '',
        description: '',
        remarks: '',
        categoryId: '',
        unitId: '',
        salePrice: '',
        purchasePrice: '',
        taxPercent: '',
        discountPercent: '',
        asOfDate: new Date().toISOString().split('T')[0]
    });

    const [warehouseRows, setWarehouseRows] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData, unitsData, warehousesData] = await Promise.all([
                productService.getProducts(),
                categoryService.getCategories(),
                uomService.getUnits(),
                warehouseService.getWarehouses()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setUnits(unitsData);
            setWarehouses(warehousesData);

            // Initialize warehouse rows with first warehouse if available
            if (warehousesData.length > 0) {
                setWarehouseRows([{
                    id: Date.now(),
                    warehouseId: warehousesData[0].id,
                    quantity: 0,
                    minOrderQty: 0,
                    initialQty: 0
                }]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleWarehouseChange = (rowId, field, value) => {
        setWarehouseRows(prev => prev.map(row =>
            row.id === rowId ? { ...row, [field]: value } : row
        ));
    };

    const addWarehouseRow = () => {
        const usedWarehouseIds = warehouseRows.map(r => r.warehouseId);
        const availableWarehouse = warehouses.find(w => !usedWarehouseIds.includes(w.id));

        setWarehouseRows([...warehouseRows, {
            id: Date.now(),
            warehouseId: availableWarehouse?.id || '',
            quantity: 0,
            minOrderQty: 0,
            initialQty: 0
        }]);
    };

    const removeWarehouseRow = (id) => {
        if (warehouseRows.length > 1) {
            setWarehouseRows(warehouseRows.filter(row => row.id !== id));
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.sku) {
            toast.error('Product name and SKU are required');
            return;
        }

        try {
            const submitData = {
                ...formData,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
                unitId: formData.unitId ? parseInt(formData.unitId) : null,
                salePrice: parseFloat(formData.salePrice) || 0,
                purchasePrice: parseFloat(formData.purchasePrice) || 0,
                taxPercent: parseFloat(formData.taxPercent) || 0,
                discountPercent: parseFloat(formData.discountPercent) || 0,
                warehouseStock: warehouseRows.filter(r => r.warehouseId).map(r => ({
                    warehouseId: parseInt(r.warehouseId),
                    quantity: parseFloat(r.quantity) || 0,
                    minOrderQty: parseFloat(r.minOrderQty) || 0,
                    initialQty: parseFloat(r.initialQty) || 0
                }))
            };

            if (showEditModal && selectedProduct) {
                await productService.updateProduct(selectedProduct.id, submitData);
                toast.success('Product updated successfully');
            } else {
                await productService.createProduct(submitData);
                toast.success('Product created successfully');
            }
            fetchData();
            closeModals();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            hsn: '',
            barcode: '',
            description: '',
            remarks: '',
            categoryId: '',
            unitId: '',
            salePrice: '',
            purchasePrice: '',
            taxPercent: '',
            discountPercent: '',
            asOfDate: new Date().toISOString().split('T')[0]
        });
        if (warehouses.length > 0) {
            setWarehouseRows([{
                id: Date.now(),
                warehouseId: warehouses[0].id,
                quantity: 0,
                minOrderQty: 0,
                initialQty: 0
            }]);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            sku: product.sku,
            hsn: product.hsn || '',
            barcode: product.barcode || '',
            description: product.description || '',
            remarks: product.remarks || '',
            categoryId: product.categoryId || '',
            unitId: product.unitId || '',
            salePrice: product.salePrice || '',
            purchasePrice: product.purchasePrice || '',
            taxPercent: product.taxPercent || '',
            discountPercent: product.discountPercent || '',
            asOfDate: product.asOfDate ? product.asOfDate.split('T')[0] : new Date().toISOString().split('T')[0]
        });

        // Set warehouse rows from existing stock
        if (product.productStock && product.productStock.length > 0) {
            setWarehouseRows(product.productStock.map(ps => ({
                id: ps.id || Date.now(),
                warehouseId: ps.warehouseId,
                quantity: ps.quantity,
                minOrderQty: ps.minOrderQty,
                initialQty: ps.initialQty
            })));
        } else if (warehouses.length > 0) {
            setWarehouseRows([{
                id: Date.now(),
                warehouseId: warehouses[0].id,
                quantity: 0,
                minOrderQty: 0,
                initialQty: 0
            }]);
        }

        setShowEditModal(true);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await productService.deleteProduct(selectedProduct.id);
            toast.success('Product deleted successfully');
            fetchData();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            await categoryService.createCategory({ name: newCategoryName });
            toast.success('Category created successfully');
            const categoriesData = await categoryService.getCategories();
            setCategories(categoriesData);
            setShowCategoryModal(false);
            setNewCategoryName('');
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category?.name && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="inventory-page">
                <div className="loading">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="inventory-page">
            <div className="page-header">
                <h1 className="page-title">Product Inventory</h1>
                <button className="btn-add" onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                }}>
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            <div className="inventory-card">
                <div className="controls-row">
                    <div className="entries-control">
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            className="entries-select"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="entries-text">entries per page</span>
                    </div>
                    <div className="search-control">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>SKU</th>
                                <th>SALE PRICE</th>
                                <th>PURCHASE PRICE</th>
                                <th>CATEGORY</th>
                                <th>UNIT</th>
                                <th>QUANTITY</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">No products found</td>
                                </tr>
                            ) : (
                                filteredProducts.slice(0, entriesPerPage).map((p) => (
                                    <tr key={p.id}>
                                        <td className="font-semibold">{p.name}</td>
                                        <td>{p.sku}</td>
                                        <td>{formatCurrency(p.salePrice)}</td>
                                        <td>{formatCurrency(p.purchasePrice)}</td>
                                        <td>{p.category?.name || '-'}</td>
                                        <td>{p.unit?.name || '-'}</td>
                                        <td>{p.totalQuantity || 0}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(p)}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(p)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {Math.min(entriesPerPage, filteredProducts.length)} of {filteredProducts.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal-overlay">
                    <div className="modal-content inventory-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{showEditModal ? 'Edit Product' : 'Add Product'}</h2>
                            <button className="close-btn" onClick={closeModals}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Item Name <span className="text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="Enter item name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">HSN</label>
                                    <input
                                        type="text"
                                        name="hsn"
                                        className="form-input"
                                        placeholder="Enter HSN code"
                                        value={formData.hsn}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Barcode</label>
                                    <input
                                        type="text"
                                        name="barcode"
                                        className="form-input"
                                        placeholder="Enter barcode"
                                        value={formData.barcode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">SKU <span className="text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="sku"
                                        className="form-input"
                                        placeholder="Enter SKU"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Item Category</label>
                                    <div className="input-with-action">
                                        <select
                                            name="categoryId"
                                            className="form-input"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <button className="btn-inline-add" onClick={() => setShowCategoryModal(true)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit of Measure</label>
                                    <select
                                        name="unitId"
                                        className="form-input"
                                        value={formData.unitId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Unit</option>
                                        {units.map(unit => (
                                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="section-title-row">
                                <h3 className="section-title">Warehouse Information</h3>
                                <button className="btn-inline-add" onClick={addWarehouseRow}>+ Add Warehouse</button>
                            </div>

                            <div className="warehouse-table-container">
                                <table className="warehouse-input-table">
                                    <thead>
                                        <tr>
                                            <th>WAREHOUSE</th>
                                            <th>QUANTITY</th>
                                            <th>MINIMUM ORDER QTY</th>
                                            <th>INITIAL QTY</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warehouseRows.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <select
                                                        className="form-input mini"
                                                        value={row.warehouseId}
                                                        onChange={(e) => handleWarehouseChange(row.id, 'warehouseId', e.target.value)}
                                                    >
                                                        <option value="">Select Warehouse</option>
                                                        {warehouses.map(wh => (
                                                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-input mini"
                                                        value={row.quantity}
                                                        onChange={(e) => handleWarehouseChange(row.id, 'quantity', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-input mini"
                                                        value={row.minOrderQty}
                                                        onChange={(e) => handleWarehouseChange(row.id, 'minOrderQty', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-input mini"
                                                        value={row.initialQty}
                                                        onChange={(e) => handleWarehouseChange(row.id, 'initialQty', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-remove"
                                                        onClick={() => removeWarehouseRow(row.id)}
                                                        disabled={warehouseRows.length <= 1}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Item Description</label>
                                <textarea
                                    name="description"
                                    className="form-input textarea"
                                    placeholder="Enter item description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">As Of Date</label>
                                    <input
                                        type="date"
                                        name="asOfDate"
                                        className="form-input"
                                        value={formData.asOfDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Tax %</label>
                                    <input
                                        type="number"
                                        name="taxPercent"
                                        className="form-input"
                                        placeholder="e.g. 18"
                                        value={formData.taxPercent}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Sale Price</label>
                                    <input
                                        type="number"
                                        name="salePrice"
                                        className="form-input"
                                        step="0.01"
                                        value={formData.salePrice}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Purchase Price</label>
                                    <input
                                        type="number"
                                        name="purchasePrice"
                                        className="form-input"
                                        step="0.01"
                                        value={formData.purchasePrice}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Discount %</label>
                                    <input
                                        type="number"
                                        name="discountPercent"
                                        className="form-input"
                                        value={formData.discountPercent}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Remarks</label>
                                <input
                                    type="text"
                                    name="remarks"
                                    className="form-input"
                                    placeholder="Enter remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeModals}>Cancel</button>
                            <button className="btn-submit" onClick={handleSubmit}>
                                {showEditModal ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '430px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Product</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '1.5rem' }}>
                            <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.5' }}>
                                Are you sure you want to delete product <strong>{selectedProduct?.name}</strong>?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="modal-footer" style={{ padding: '1.25rem', backgroundColor: '#f9fafb', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)} style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#ef4444' }} onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Category Modal */}
            {showCategoryModal && (
                <div className="modal-overlay sub-modal">
                    <div className="modal-content category-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Add New Category</h2>
                            <button className="close-btn" onClick={() => setShowCategoryModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter new category name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                            <button className="btn-submit" onClick={handleAddCategory}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
