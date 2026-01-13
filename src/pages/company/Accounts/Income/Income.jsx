import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye, Receipt, Upload, Trash, FileText, Filter } from 'lucide-react';
import './Income.css';

const Income = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [receiptImage, setReceiptImage] = useState(null);

    // Mock data based on requested fields
    const [incomes] = useState([
        {
            id: 1,
            date: '2026-01-13',
            account: 'ROUNDBANK Benjamin Adams',
            customer: 'Protiong',
            category: 'Clothing',
            reference: 'REF-001',
            amount: '₹ 10,000.00',
            status: 'Received',
            description: 'Payment for bulk order'
        },
        {
            id: 2,
            date: '2026-01-12',
            account: 'Cash Account',
            customer: 'Walk-in Customer',
            category: 'Services',
            reference: 'REF-002',
            amount: '₹ 2,500.00',
            status: 'Received',
            description: 'Direct service payment'
        },
    ]);

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    setReceiptImage(readerEvent.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    return (
        <div className="income-page">
            <div className="page-header">
                <h1 className="page-title">Income</h1>
                <button className="btn-add" style={{ backgroundColor: '#8ce043' }} onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Create Income Voucher
                </button>
            </div>

            <div className="income-card">
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
                    <table className="income-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>ACCOUNT</th>
                                <th>CUSTOMER</th>
                                <th>CATEGORY</th>
                                <th>REFERENCE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map((inc) => (
                                <tr key={inc.id}>
                                    <td>{inc.date}</td>
                                    <td className="account-cell">{inc.account}</td>
                                    <td>{inc.customer}</td>
                                    <td><span className="category-badge">{inc.category}</span></td>
                                    <td>{inc.reference}</td>
                                    <td className="amount-cell">{inc.amount}</td>
                                    <td><span className="status-badge received">Received</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" onClick={() => { setSelectedIncome(inc); setShowViewModal(true); }}>
                                                <Eye size={18} />
                                            </button>
                                            <button className="action-btn btn-edit" onClick={() => { setSelectedIncome(inc); setShowEditModal(true); }}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="action-btn btn-delete" onClick={() => { setSelectedIncome(inc); setShowDeleteModal(true); }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {incomes.length} of {incomes.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Create Revenue Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal-overlay">
                    <div className="modal-content revenue-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Create New Revenue</h2>
                            <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Date <span className="text-red-500">*</span></label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Amount <span className="text-red-500">*</span></label>
                                    <input type="number" className="form-input" placeholder="Enter Amount" />
                                </div>
                            </div>

                            <div className="form-grid-2 mt-4">
                                <div className="form-group">
                                    <label className="form-label">Account <span className="text-red-500">*</span></label>
                                    <select className="form-input">
                                        <option>ROUNDBANK Benjamin Adams</option>
                                        <option>Cash Account</option>
                                    </select>
                                    <span className="inline-link-sm mt-1">Create account here. <a href="#" style={{ color: '#8ce043' }}>Create account</a></span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Customer <span className="text-red-500">*</span></label>
                                    <select className="form-input">
                                        <option>Protiong</option>
                                        <option>John Doe</option>
                                    </select>
                                    <span className="inline-link-sm mt-1">Create customer here. <a href="#" style={{ color: '#8ce043' }}>Create customer</a></span>
                                </div>
                            </div>

                            <div className="form-group mt-4">
                                <label className="form-label">Description</label>
                                <textarea className="form-input textarea" rows={3} placeholder="Enter Description"></textarea>
                            </div>

                            <div className="form-grid-2 mt-4">
                                <div className="form-group">
                                    <label className="form-label">Category <span className="text-red-500">*</span></label>
                                    <select className="form-input">
                                        <option>Clothing</option>
                                        <option>Electronics</option>
                                        <option>Services</option>
                                    </select>
                                    <span className="inline-link-sm mt-1">Create category here. <a href="#" style={{ color: '#8ce043' }}>Create category</a></span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reference</label>
                                    <input type="text" className="form-input" placeholder="Enter Reference" />
                                </div>
                            </div>

                            <div className="form-group mt-4">
                                <label className="form-label">Payment Receipt</label>
                                <div className="file-upload-area">
                                    <div className="file-input-wrapper">
                                        <button className="btn-file" onClick={handleImageUpload}>Choose File</button>
                                        <span className="file-status">{receiptImage ? 'Image Selected' : 'No file chosen'}</span>
                                    </div>
                                    <div className="image-preview-placeholder mt-3" onClick={handleImageUpload}>
                                        {receiptImage ? (
                                            <img src={receiptImage} alt="Receipt Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <div className="placeholder-icon">
                                                <Upload size={32} color="#cbd5e1" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel-dark" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && (
                <div className="modal-overlay">
                    <div className="modal-content revenue-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Revenue Details</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-grid-3">
                                <div className="view-item">
                                    <label>DATE</label>
                                    <p>{selectedIncome?.date}</p>
                                </div>
                                <div className="view-item">
                                    <label>AMOUNT</label>
                                    <p className="amount-text">{selectedIncome?.amount}</p>
                                </div>
                                <div className="view-item">
                                    <label>STATUS</label>
                                    <span className="status-badge received">Received</span>
                                </div>
                            </div>
                            <div className="view-grid-2 mt-4">
                                <div className="view-item">
                                    <label>ACCOUNT</label>
                                    <p>{selectedIncome?.account}</p>
                                </div>
                                <div className="view-item">
                                    <label>CUSTOMER</label>
                                    <p>{selectedIncome?.customer}</p>
                                </div>
                            </div>
                            <div className="view-grid-2 mt-4">
                                <div className="view-item">
                                    <label>CATEGORY</label>
                                    <p>{selectedIncome?.category}</p>
                                </div>
                                <div className="view-item">
                                    <label>REFERENCE</label>
                                    <p>{selectedIncome?.reference}</p>
                                </div>
                            </div>
                            <div className="view-item mt-4">
                                <label>DESCRIPTION</label>
                                <p className="description-box">{selectedIncome?.description}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }} onClick={() => { setShowViewModal(false); setShowEditModal(true); }}>Edit Revenue</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Revenue</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body text-center py-4">
                            <Trash2 size={48} color="#ef4444" className="mx-auto mb-3" />
                            <p className="text-gray-600">Are you sure you want to delete this revenue record?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#ef4444' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Income;
