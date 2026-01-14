import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye, Calendar, ArrowRight } from 'lucide-react';
import './StockTransfer.css';

const StockTransfer = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState(null);

    // Mock data
    const [transfers] = useState([
        {
            id: 1,
            voucherNo: 'ST-001',
            date: '2026-01-13',
            source: 'Main Warehouse',
            destination: 'Retail Store',
            items: '5 Items',
            total: '$1,250.00'
        },
        {
            id: 2,
            voucherNo: 'ST-002',
            date: '2026-01-12',
            source: 'North Hub',
            destination: 'Main Warehouse',
            items: '2 Items',
            total: '$450.00'
        }
    ]);

    const handleView = (transfer) => {
        setSelectedTransfer(transfer);
        setShowViewModal(true);
    };

    const handleEdit = (transfer) => {
        setSelectedTransfer(transfer);
        setShowEditModal(true);
    };

    const handleDelete = (transfer) => {
        setSelectedTransfer(transfer);
        setShowDeleteModal(true);
    };

    return (
        <div className="stock-transfer-page">
            <div className="page-header">
                <h1 className="page-title">Stock Transfer</h1>
                <button className="btn-add" style={{ backgroundColor: '#8ce043' }} onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Stock Transfer
                </button>
            </div>

            <div className="transfer-card">
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
                    <table className="transfer-table">
                        <thead>
                            <tr>
                                <th>VOUCHER NO</th>
                                <th>DATE</th>
                                <th>SOURCE</th>
                                <th>DESTINATION</th>
                                <th>ITEMS</th>
                                <th>TOTAL</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfers.map((t) => (
                                <tr key={t.id}>
                                    <td className="voucher-no">{t.voucherNo}</td>
                                    <td>{t.date}</td>
                                    <td>{t.source}</td>
                                    <td>{t.destination}</td>
                                    <td>{t.items}</td>
                                    <td>{t.total}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" data-tooltip="View" onClick={() => handleView(t)}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(t)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(t)}>
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
                    <p className="pagination-info">Showing 1 to {transfers.length} of {transfers.length} entries</p>
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
                    <div className="modal-content stock-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{showEditModal ? 'Edit Stock Transfer' : 'New Stock Transfer'}</h2>
                            <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">System Voucher No</label>
                                    <input type="text" className="form-input disabled-input" value="VCH-260113-888" readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Manual Voucher No</label>
                                    <input type="text" className="form-input" placeholder="Manual Voucher No" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Voucher Date <span className="text-red">*</span></label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Destination Warehouse <span className="text-red">*</span></label>
                                <select className="form-input">
                                    <option value="">Select destination warehouse</option>
                                    <option>Main Warehouse</option>
                                    <option>Retail Store</option>
                                    <option>North Hub</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Select Item</label>
                                <div className="search-wrapper">
                                    <Search size={16} className="search-icon-inline" />
                                    <input type="text" className="form-input with-icon" placeholder="Search by name, SKU, or barcode" />
                                </div>
                            </div>

                            <div className="items-table-container">
                                <table className="items-input-table">
                                    <thead>
                                        <tr>
                                            <th>ITEM</th>
                                            <th>SOURCE WH</th>
                                            <th>QTY</th>
                                            <th>RATE</th>
                                            <th>AMOUNT</th>
                                            <th>NARRATION</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Row example */}
                                        <tr className="empty-row">
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                                                No items added
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Narration</label>
                                <textarea className="form-input textarea" rows={3} placeholder="Narration"></textarea>
                            </div>

                            <div className="modal-summary">
                                <span className="total-label">Total:</span>
                                <span className="total-amount">$0.00</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>
                                {showEditModal ? 'Update Transfer' : 'Save Transfer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && (
                <div className="modal-overlay">
                    <div className="modal-content stock-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Stock Transfer Details</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-header-info">
                                <div className="view-chip">
                                    <label>Voucher No</label>
                                    <p>{selectedTransfer?.voucherNo}</p>
                                </div>
                                <div className="view-chip">
                                    <label>Date</label>
                                    <p>{selectedTransfer?.date}</p>
                                </div>
                            </div>

                            <div className="transfer-route">
                                <div className="route-point">
                                    <label>From</label>
                                    <p>{selectedTransfer?.source}</p>
                                </div>
                                <ArrowRight size={24} className="route-arrow" />
                                <div className="route-point">
                                    <label>To</label>
                                    <p>{selectedTransfer?.destination}</p>
                                </div>
                            </div>

                            <div className="view-items-section">
                                <h3 className="section-subtitle">Items Transferred</h3>
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
                                            <td>Example Product A</td>
                                            <td>5</td>
                                            <td>$100.00</td>
                                            <td>$500.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="view-total-row">
                                <span>Total Amount:</span>
                                <strong>{selectedTransfer?.total}</strong>
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
                            <h2 className="modal-title">Delete Transfer</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete transfer <strong>{selectedTransfer?.voucherNo}</strong>?</p>
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

export default StockTransfer;
