import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
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

    // Mock data based on image
    const [products] = useState([
        { id: 1, name: 'Jackets', sku: '00120', salePrice: '$2,000.00', purchasePrice: '$1,900.00', tax: 'CGST', category: 'Fashion', unit: 'Piece', quantity: 200, type: 'Product' },
        { id: 2, name: 'Headphone', sku: 'HL005MET', salePrice: '$2,000.00', purchasePrice: '$1,500.00', tax: 'SGST', category: 'Accessories', unit: 'Inch', quantity: 501, type: 'Product' },
        { id: 3, name: 'iphone', sku: 'HL005MET', salePrice: '$40,000.00', purchasePrice: '$35,000.00', tax: 'CGST', category: 'Accessories', unit: 'Piece', quantity: 1500, type: 'Product' },
        { id: 4, name: 'Refrigerator', sku: 'BC008ACC', salePrice: '$50,000.00', purchasePrice: '$50,000.00', tax: 'CGST SGST', category: 'Accessories', unit: 'Piece', quantity: 989, type: 'Product' },
        { id: 5, name: 'Purse', sku: '001452', salePrice: '$526.00', purchasePrice: '$694.00', tax: 'SGST', category: 'Accessories', unit: 'Inch', quantity: '-', type: 'Service' },
    ]);

    const [warehouseRows, setWarehouseRows] = useState([
        { id: Date.now(), warehouse: 'PrimeSpace Warehousing', quantity: 0, minOrder: 0, initialQty: 0 }
    ]);

    const addWarehouseRow = () => {
        setWarehouseRows([...warehouseRows, { id: Date.now(), warehouse: '', quantity: 0, minOrder: 0, initialQty: 0 }]);
    };

    const removeWarehouseRow = (id) => {
        setWarehouseRows(warehouseRows.filter(row => row.id !== id));
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    return (
        <div className="inventory-page">
            <div className="page-header">
                <h1 className="page-title">Product Inventory</h1>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
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
                                {/* <th>TAX</th> */}
                                <th>CATEGORY</th>
                                <th>UNIT</th>
                                <th>QUANTITY</th>
                                {/* <th>TYPE</th> */}
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td className="font-semibold">{p.name}</td>
                                    <td>{p.sku}</td>
                                    <td>{p.salePrice}</td>
                                    <td>{p.purchasePrice}</td>
                                    {/* <td>
                                        {p.tax.split(' ').map(t => (
                                            <div key={t} className="tax-tag">{t}</div>
                                        ))}
                                    </td> */}
                                    <td>{p.category}</td>
                                    <td>{p.unit}</td>
                                    <td>{p.quantity}</td>
                                    {/* <td>
                                        <span className={`type-badge ${p.type.toLowerCase()}`}>
                                            {p.type}
                                        </span>
                                    </td> */}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {products.length} of {products.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content inventory-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Add Product</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Item Name <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" placeholder="Enter item name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">HSN</label>
                                    <input type="text" className="form-input" placeholder="Enter HSN code" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Barcode</label>
                                    <input type="text" className="form-input" placeholder="Enter barcode" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Item Image</label>
                                    <div className="file-input-wrapper">
                                        <label className="file-label">
                                            <span>Choose File</span>
                                            <input type="file" className="hidden-file-input" />
                                        </label>
                                        <span className="file-name">No file chosen</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Item Category <span className="text-red">*</span></label>
                                    <div className="input-with-action">
                                        <select className="form-input">
                                            <option>Select Category</option>
                                        </select>
                                        <button className="btn-inline-add" onClick={() => setShowCategoryModal(true)}><Plus size={16} /></button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit of Measure</label>
                                    <select className="form-input">
                                        <option>IN</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">SKU <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" placeholder="Enter SKU" />
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
                                            <th>MINIMUM ORDER QUANTITY</th>
                                            <th>INITIAL QUANTITY ON HAND</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warehouseRows.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <select className="form-input mini">
                                                        <option>PrimeSpace Warehousing</option>
                                                    </select>
                                                </td>
                                                <td><input type="number" className="form-input mini" defaultValue={0} /></td>
                                                <td><input type="number" className="form-input mini" defaultValue={0} /></td>
                                                <td><input type="number" className="form-input mini" defaultValue={0} /></td>
                                                <td>
                                                    <button className="btn-remove" onClick={() => removeWarehouseRow(row.id)}>Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Item Description</label>
                                <textarea className="form-input textarea" placeholder="Enter item description" rows={3}></textarea>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">As Of Date</label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Tax Account</label>
                                    <input type="text" className="form-input" placeholder="Enter tax account" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Initial Cost/Unit</label>
                                    <input type="number" className="form-input" defaultValue={0.00} step="0.01" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Sale Price (Exclusive)</label>
                                    <input type="number" className="form-input" defaultValue={0.00} step="0.01" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Purchase Price (Inclusive)</label>
                                    <input type="number" className="form-input" defaultValue={0.00} step="0.01" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Discount %</label>
                                    <input type="number" className="form-input" defaultValue={0} />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Remarks</label>
                                <input type="text" className="form-input" placeholder="Enter remarks" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-submit">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content inventory-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Product</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Item Name <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" defaultValue={selectedProduct?.name} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">HSN</label>
                                    <input type="text" className="form-input" placeholder="Enter HSN code" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Barcode</label>
                                    <input type="text" className="form-input" defaultValue={selectedProduct?.sku} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Item Image</label>
                                    <div className="file-input-wrapper">
                                        <label className="file-label">
                                            <span>Choose File</span>
                                            <input type="file" className="hidden-file-input" />
                                        </label>
                                        <span className="file-name">No file chosen</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Item Category <span className="text-red">*</span></label>
                                    <div className="input-with-action">
                                        <select className="form-input" defaultValue={selectedProduct?.category}>
                                            <option>{selectedProduct?.category}</option>
                                        </select>
                                        <button className="btn-inline-add" onClick={() => setShowCategoryModal(true)}> <Plus size={16} /></button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit of Measure</label>
                                    <select className="form-input" defaultValue={selectedProduct?.unit}>
                                        <option>{selectedProduct?.unit}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">SKU <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" defaultValue={selectedProduct?.sku} />
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
                                            <th>MINIMUM ORDER QUANTITY</th>
                                            <th>INITIAL QUANTITY ON HAND</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warehouseRows.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <select className="form-input mini">
                                                        <option>PrimeSpace Warehousing</option>
                                                    </select>
                                                </td>
                                                <td><input type="number" className="form-input mini" defaultValue={selectedProduct?.quantity === '-' ? 0 : selectedProduct?.quantity} /></td>
                                                <td><input type="number" className="form-input mini" defaultValue={0} /></td>
                                                <td><input type="number" className="form-input mini" defaultValue={0} /></td>
                                                <td>
                                                    <button className="btn-remove" onClick={() => removeWarehouseRow(row.id)}>Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Item Description</label>
                                <textarea className="form-input textarea" placeholder="Enter item description" rows={3}></textarea>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">As Of Date</label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Tax Account</label>
                                    <input type="text" className="form-input" defaultValue={selectedProduct?.tax} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Initial Cost/Unit</label>
                                    <input type="text" className="form-input" defaultValue={selectedProduct?.purchasePrice?.replace('$', '')} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Sale Price (Exclusive)</label>
                                    <input type="text" className="form-input" defaultValue={selectedProduct?.salePrice?.replace('$', '')} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Purchase Price (Inclusive)</label>
                                    <input type="text" className="form-input" defaultValue={selectedProduct?.purchasePrice?.replace('$', '')} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Default Discount %</label>
                                    <input type="number" className="form-input" defaultValue={0} />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Remarks</label>
                                <input type="text" className="form-input" placeholder="Enter remarks" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#4dd0e1' }}>Update</button>
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
                            <button className="btn-submit" style={{ backgroundColor: '#ef4444' }}>Delete</button>
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
                            <button className="btn-submit" onClick={() => {
                                // Logic to add category would go here
                                setShowCategoryModal(false);
                                setNewCategoryName('');
                            }}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
