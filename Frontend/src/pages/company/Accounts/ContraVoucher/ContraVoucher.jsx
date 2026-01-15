import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye, Receipt, Upload, Trash, FileText, Filter } from 'lucide-react';
import './ContraVoucher.css';

const ContraVoucher = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [receiptImage, setReceiptImage] = useState(null);

    // Mock data based on requested fields
    const [vouchers] = useState([
        {
            id: 1,
            date: '2026-01-13',
            voucherNo: 'CV-001',
            accountFrom: 'HDFC Bank',
            accountTo: 'Petty Cash',
            amount: '₹ 5,000.00',
            narration: 'Cash withdrawal for office use',
            status: 'Completed'
        },
        {
            id: 2,
            date: '2026-01-12',
            voucherNo: 'CV-002',
            accountFrom: 'Cash Account',
            accountTo: 'ICICI Bank',
            amount: '₹ 15,000.00',
            narration: 'Cash deposit into bank',
            status: 'Completed'
        },
    ]);

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,application/pdf';
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
        <div className="contra-page">
            <div className="page-header">
                <h1 className="page-title">Contra Voucher</h1>
                <button className="btn-add" style={{ backgroundColor: '#8ce043' }} onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Contra Voucher
                </button>
            </div>

            <div className="contra-card">
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
                    <table className="contra-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>VOUCHER NO</th>
                                <th>ACCOUNT FROM</th>
                                <th>ACCOUNT TO</th>
                                <th>AMOUNT</th>
                                <th>NARRATION</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.date}</td>
                                    <td className="voucher-no">{v.voucherNo}</td>
                                    <td className="acc-from">{v.accountFrom}</td>
                                    <td className="acc-to">{v.accountTo}</td>
                                    <td className="amount-cell">{v.amount}</td>
                                    <td className="narration-cell">{v.narration}</td>
                                    <td><span className="contra-status-badge completed">{v.status}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" onClick={() => { setSelectedVoucher(v); setShowViewModal(true); }}>
                                                <Eye size={18} />
                                            </button>
                                            <button className="action-btn btn-edit" onClick={() => { setSelectedVoucher(v); setShowEditModal(true); }}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="action-btn btn-delete" onClick={() => { setSelectedVoucher(v); setShowDeleteModal(true); }}>
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
                    <p className="pagination-info">Showing 1 to {vouchers.length} of {vouchers.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div >

            {/* Add Contra Voucher Modal */}
            {
                (showAddModal || showEditModal) && (
                    <div className="modal-overlay">
                        <div className="modal-content contra-modal">
                            <div className="modal-header">
                                <h2 className="modal-title">Add Contra Voucher</h2>
                                <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Voucher No (Manual)</label>
                                        <input type="text" className="form-input" placeholder="Optional" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Voucher Date <span className="text-red-500">*</span></label>
                                        <input type="date" className="form-input" defaultValue="2026-01-13" />
                                    </div>
                                </div>

                                <div className="form-grid-2 mt-4">
                                    <div className="form-group">
                                        <label className="form-label">Account From <span className="text-red-500">*</span></label>
                                        <input type="text" className="form-input" placeholder="Accounts Payable (ABC Traders)" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Account To <span className="text-red-500">*</span></label>
                                        <input type="text" className="form-input" placeholder="Accounts Receivable (XYZ Pvt. Ltd)" />
                                    </div>
                                </div>

                                <div className="form-grid-2 mt-4">
                                    <div className="form-group">
                                        <label className="form-label">Amount <span className="text-red-500">*</span></label>
                                        <input type="number" className="form-input" placeholder="Enter amount" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Upload Document (Optional)</label>
                                        <div className="file-input-wrapper-inline">
                                            <button className="btn-file" onClick={handleImageUpload}>Choose File</button>
                                            <span className="file-status">{receiptImage ? 'Document uploaded' : 'No file chosen'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mt-4">
                                    <label className="form-label">Narration (Optional)</label>
                                    <textarea className="form-input textarea" rows={4} placeholder="Enter details..."></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-cancel-dark" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
                                <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Save</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* View Modal */}
            {
                showViewModal && (
                    <div className="modal-overlay">
                        <div className="modal-content contra-modal">
                            <div className="modal-header">
                                <h2 className="modal-title">Contra Voucher Details</h2>
                                <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="view-header-grid">
                                    <div className="view-group">
                                        <label>DATE</label>
                                        <p>{selectedVoucher?.date}</p>
                                    </div>
                                    <div className="view-group">
                                        <label>VOUCHER NO</label>
                                        <p className="voucher-no">{selectedVoucher?.voucherNo}</p>
                                    </div>
                                    <div className="view-group">
                                        <label>AMOUNT</label>
                                        <p className="amount-text">{selectedVoucher?.amount}</p>
                                    </div>
                                </div>

                                <div className="view-payment-grid mt-4">
                                    <div className="view-group">
                                        <label>ACCOUNT FROM</label>
                                        <p className="text-lg font-bold acc-from">{selectedVoucher?.accountFrom}</p>
                                    </div>
                                    <div className="view-group">
                                        <label>ACCOUNT TO</label>
                                        <p className="text-lg font-bold acc-to">{selectedVoucher?.accountTo}</p>
                                    </div>
                                </div>

                                <div className="view-narration-section mt-4">
                                    <label className="form-label text-xs uppercase font-bold text-gray-500">Narration</label>
                                    <p className="view-narration-box">{selectedVoucher?.narration}</p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
                                <button className="btn-submit" style={{ backgroundColor: '#8ce043' }} onClick={() => { setShowViewModal(false); setShowEditModal(true); }}>Edit Voucher</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Modal */}
            {
                showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '400px' }}>
                            <div className="modal-header">
                                <h2 className="modal-title">Delete Voucher</h2>
                                <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body text-center py-4">
                                <Trash2 size={48} color="#ef4444" className="text-center mx-auto mb-3" />
                                <p className="text-gray-600">Are you sure you want to delete contra voucher <strong>{selectedVoucher?.voucherNo}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn-submit" style={{ backgroundColor: '#ef4444' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ContraVoucher;
