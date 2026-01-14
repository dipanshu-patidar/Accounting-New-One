import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye, Printer } from 'lucide-react';
import './InventoryAdjustment.css';

const InventoryAdjustment = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAdjustment, setSelectedAdjustment] = useState(null);
    const [adjustmentType, setAdjustmentType] = useState('Add Stock');

    // Mock data
    const [adjustments] = useState([
        {
            id: 1,
            autoVoucherNo: 'ADJ-260113-803',
            manualVoucherNo: 'M-001',
            date: '2026-01-13',
            type: 'Add Stock',
            warehouse: 'Main Warehouse',
            items: '3 Items',
            totalAmount: '$750.00'
        },
        {
            id: 2,
            autoVoucherNo: 'ADJ-260112-750',
            manualVoucherNo: 'M-002',
            date: '2026-01-12',
            type: 'Remove Stock',
            warehouse: 'Retail Store',
            items: '1 Item',
            totalAmount: '$120.00'
        }
    ]);

    const handleView = (adj) => {
        setSelectedAdjustment(adj);
        setShowViewModal(true);
    };

    const handleEdit = (adj) => {
        setSelectedAdjustment(adj);
        setShowEditModal(true);
    };

    const handleDelete = (adj) => {
        setSelectedAdjustment(adj);
        setShowDeleteModal(true);
    };

    return (
        <div className="adjustment-page">
            <div className="page-header">
                <h1 className="page-title">Inventory Adjustment</h1>
                <button className="btn-add" style={{ backgroundColor: '#8ce043' }} onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Inventory Adjustment
                </button>
            </div>

            <div className="adjustment-card">
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
                    <table className="adjustment-table">
                        <thead>
                            <tr>
                                <th>AUTO VOUCHER NO</th>
                                <th>MANUAL VOUCHER NO</th>
                                <th>DATE</th>
                                <th>TYPE</th>
                                <th>SOURCE WAREHOUSE</th>
                                <th>ITEMS</th>
                                <th>TOTAL AMOUNT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustments.map((a) => (
                                <tr key={a.id}>
                                    <td className="voucher-no">{a.autoVoucherNo}</td>
                                    <td>{a.manualVoucherNo}</td>
                                    <td>{a.date}</td>
                                    <td>
                                        <span className={`type-badge ${a.type.toLowerCase().replace(' ', '-')}`}>
                                            {a.type}
                                        </span>
                                    </td>
                                    <td>{a.warehouse}</td>
                                    <td>{a.items}</td>
                                    <td>{a.totalAmount}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" data-tooltip="View" onClick={() => handleView(a)}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(a)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(a)}>
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
                    <p className="pagination-info">Showing 1 to {adjustments.length} of {adjustments.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal-overlay">
                    <div className="modal-content inventory-adjustment-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{showEditModal ? 'Edit Inventory Adjustment' : 'New Inventory Adjustment'}</h2>
                            <div className="header-actions">
                                <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">System Voucher No</label>
                                    <input type="text" className="form-input disabled-input" value="ADJ-260113-803" readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Manual Voucher No</label>
                                    <input type="text" className="form-input" placeholder="Enter manual No" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Voucher Date <span className="text-red">*</span></label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Adjustment Type <span className="text-red">*</span></label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="adjType"
                                            value="Add Stock"
                                            checked={adjustmentType === 'Add Stock'}
                                            onChange={(e) => setAdjustmentType(e.target.value)}
                                        />
                                        Add Stock
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="adjType"
                                            value="Remove Stock"
                                            checked={adjustmentType === 'Remove Stock'}
                                            onChange={(e) => setAdjustmentType(e.target.value)}
                                        />
                                        Remove Stock
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="adjType"
                                            value="Adjust Value"
                                            checked={adjustmentType === 'Adjust Value'}
                                            onChange={(e) => setAdjustmentType(e.target.value)}
                                        />
                                        Adjust Value
                                    </label>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Select Item</label>
                                <div className="search-wrapper">
                                    <Search size={16} className="search-icon-inline" />
                                    <input type="text" className="form-input with-icon" placeholder="Search for an item..." />
                                </div>
                            </div>

                            <div className="items-table-container">
                                <table className="items-input-table">
                                    <thead>
                                        <tr>
                                            <th>ITEM</th>
                                            <th>SOURCE WAREHOUSE</th>
                                            <th>QUANTITY</th>
                                            <th>RATE</th>
                                            <th>AMOUNT</th>
                                            <th>ACTIONS</th>
                                            <th>NARRATION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="empty-row">
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                                                Search and select items to add
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="footer-flex-row">
                                <div className="form-group flex-1">
                                    <label className="form-label">Additional Note</label>
                                    <textarea className="form-input textarea" rows={3} placeholder="Enter a general note..."></textarea>
                                </div>
                                <div className="total-display-card">
                                    <label>Total Value</label>
                                    <div className="total-input-wrapper">
                                        <span className="currency-symbol">$</span>
                                        <input type="text" className="total-input" value="0.00" readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Save Adjustment</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && (
                <div className="modal-overlay">
                    <div className="modal-content inventory-adjustment-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Adjustment Details</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-grid">
                                <div className="view-item">
                                    <label>Auto Voucher No</label>
                                    <p>{selectedAdjustment?.autoVoucherNo}</p>
                                </div>
                                <div className="view-item">
                                    <label>Manual Voucher No</label>
                                    <p>{selectedAdjustment?.manualVoucherNo || 'N/A'}</p>
                                </div>
                                <div className="view-item">
                                    <label>Date</label>
                                    <p>{selectedAdjustment?.date}</p>
                                </div>
                                <div className="view-item">
                                    <label>Adjustment Type</label>
                                    <p>{selectedAdjustment?.type}</p>
                                </div>
                                <div className="view-item full">
                                    <label>Source Warehouse</label>
                                    <p>{selectedAdjustment?.warehouse}</p>
                                </div>
                            </div>

                            <div className="view-items-section">
                                <h3 className="section-subtitle">Adjusted Items</h3>
                                <table className="view-items-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Qty</th>
                                            <th>Rate</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Sample Item A</td>
                                            <td>10</td>
                                            <td>$25.00</td>
                                            <td>$250.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="view-total-row">
                                <span>Total Adjusted Value:</span>
                                <strong>{selectedAdjustment?.totalAmount}</strong>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Adjustment</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete adjustment <strong>{selectedAdjustment?.autoVoucherNo}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#ff4d4d' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryAdjustment;