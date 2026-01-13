import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye, Receipt, Upload, Trash } from 'lucide-react';
import './CreateVoucher.css';

const CreateVoucher = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    // Mock data
    const [vouchers] = useState([
        { id: 1, type: 'Expense', date: '2026-01-13', party: 'Tech Sol Ltd', voucherNo: 'V-2026-001', amount: '₹ 2,500.00' },
        { id: 2, type: 'Income', date: '2026-01-12', party: 'Global Corp', voucherNo: 'V-2026-002', amount: '₹ 15,000.00' },
    ]);

    // Modal State
    const [items, setItems] = useState([{ id: Date.now(), name: '', rate: 0, qty: 1, amount: 0 }]);
    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), name: '', rate: 0, qty: 1, amount: 0 }]);
    };

    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleLogoUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    setLogo(readerEvent.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleSignatureUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    setSignature(readerEvent.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleView = (v) => {
        setSelectedVoucher(v);
        setShowViewModal(true);
    };

    const handleEdit = (v) => {
        setSelectedVoucher(v);
        setShowEditModal(true);
    };

    const handleDelete = (v) => {
        setSelectedVoucher(v);
        setShowDeleteModal(true);
    };

    return (
        <div className="voucher-page">
            <div className="page-header">
                <h1 className="page-title">Vouchers</h1>
                <button className="btn-add" style={{ backgroundColor: '#8ce043' }} onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Create Voucher
                </button>
            </div>

            <div className="voucher-card">
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
                    <table className="voucher-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>TYPE</th>
                                <th>DATE</th>
                                <th>CUSTOMER/VENDOR</th>
                                <th>VOUCHER NO</th>
                                <th>AMOUNT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((v, index) => (
                                <tr key={v.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <span className={`type-badge ${v.type.toLowerCase()}`}>
                                            {v.type}
                                        </span>
                                    </td>
                                    <td>{v.date}</td>
                                    <td>{v.party}</td>
                                    <td className="voucher-no-text">{v.voucherNo}</td>
                                    <td className="font-semibold text-green-600">{v.amount}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" data-tooltip="View" onClick={() => handleView(v)}>
                                                <Eye size={18} />
                                            </button>
                                            <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(v)}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(v)}>
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
            </div>

            {/* Create/Edit Voucher Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal-overlay">
                    <div className="modal-content voucher-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Create Voucher</h2>
                            <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label className="form-label">Voucher Type <span className="text-red">*</span></label>
                                <select className="form-input">
                                    <option>Expense</option>
                                    <option>Income</option>
                                    <option>Contra</option>
                                </select>
                            </div>

                            <div className="voucher-header-top">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Company Name</label>
                                    <input type="text" className="form-input" placeholder="Enter Company Name" />
                                </div>
                                <div className="logo-upload-area" onClick={handleLogoUpload}>
                                    {logo ? (
                                        <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <>
                                            <Upload size={24} color="#94a3b8" />
                                            <span className="logo-upload-placeholder">LOGO<br />Click to upload</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Paid From (Cash/Bank) <span className="text-red">*</span></label>
                                    <select className="form-input">
                                        <option>Select Account</option>
                                        <option>Cash in Hand</option>
                                        <option>HDFC Bank</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Paid To (Vendor) <span className="text-red">*</span></label>
                                    <div className="search-wrapper">
                                        <input type="text" className="form-input" placeholder="Search vendor by name or phone..." />
                                        <Search size={16} className="search-icon-inside" style={{ right: '12px', left: 'auto', position: 'absolute' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Voucher Number</label>
                                    <input type="text" className="form-input" defaultValue="INV0001" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date <span className="text-red">*</span></label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                            </div>

                            <div className="product-details-header">
                                <h3 className="product-details-title">Product Details</h3>
                            </div>

                            <div className="table-container thin-border">
                                <table className="voucher-items-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40%' }}>PRODUCT</th>
                                            <th>RATE</th>
                                            <th>QTY</th>
                                            <th>AMOUNT</th>
                                            <th style={{ width: '50px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="search-wrapper no-margin">
                                                        <input type="text" className="form-input input-sm" placeholder="Search and select a product..." />
                                                        <Search size={14} className="search-icon-inside-sm" style={{ right: '8px', left: 'auto', position: 'absolute' }} />
                                                    </div>
                                                    <input type="text" className="form-input input-sm mt-1" placeholder="Enter product name" />
                                                </td>
                                                <td>
                                                    <input type="number" className="form-input input-sm" defaultValue={item.rate} />
                                                </td>
                                                <td>
                                                    <input type="number" className="form-input input-sm" defaultValue={item.qty} />
                                                </td>
                                                <td className="font-semibold text-center">₹ 0.00</td>
                                                <td>
                                                    <button className="btn-delete-item" onClick={() => handleRemoveItem(item.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button className="btn-add-item-link" onClick={handleAddItem} style={{ color: '#8ce043', borderColor: '#8ce043' }}>
                                + Add Item
                            </button>

                            <div className="voucher-footer-grid">
                                <div className="notes-section">
                                    <label className="form-label">Notes</label>
                                    <textarea className="form-input textarea" rows={4} placeholder="Notes"></textarea>
                                </div>
                                <div className="totals-section">
                                    <div className="total-row">
                                        <span>Subtotal</span>
                                        <span>₹ 0.00</span>
                                    </div>
                                    <div className="total-row grand-total">
                                        <span>Total</span>
                                        <span>₹ 0.00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="signature-section">
                                <span className="signature-label">Signature</span>
                                <div className="signature-upload-wrapper">
                                    {signature && (
                                        <div className="signature-preview mb-3">
                                            <img src={signature} alt="Signature" style={{ maxHeight: '80px', borderBottom: '1px solid #eee' }} />
                                            <button className="remove-sig" onClick={() => setSignature(null)}><X size={12} /></button>
                                        </div>
                                    )}
                                    <button className="btn-upload-signature" onClick={handleSignatureUpload} style={{ backgroundColor: '#8ce043' }}>
                                        <Upload size={16} /> Upload Signature
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Save Voucher</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Voucher Modal */}
            {showViewModal && (
                <div className="modal-overlay">
                    <div className="modal-content voucher-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">View Voucher</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-header-grid">
                                <div className="view-group">
                                    <label>VOUCHER TYPE</label>
                                    <span className={`type-badge ${selectedVoucher?.type.toLowerCase()}`}>{selectedVoucher?.type}</span>
                                </div>
                                <div className="view-group">
                                    <label>VOUCHER NO</label>
                                    <p className="voucher-no-text">{selectedVoucher?.voucherNo}</p>
                                </div>
                                <div className="view-group">
                                    <label>DATE</label>
                                    <p>{selectedVoucher?.date}</p>
                                </div>
                            </div>

                            <div className="view-party-info mt-4">
                                <div className="view-group">
                                    <label>CUSTOMER/VENDOR</label>
                                    <p className="font-bold text-lg">{selectedVoucher?.party}</p>
                                </div>
                            </div>

                            <div className="product-details-header mt-5">
                                <h3 className="product-details-title">Product Details</h3>
                            </div>

                            <table className="voucher-items-table view-mode">
                                <thead>
                                    <tr>
                                        <th>PRODUCT</th>
                                        <th>RATE</th>
                                        <th>QTY</th>
                                        <th>AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Mock items for view */}
                                    <tr>
                                        <td>Product A</td>
                                        <td>₹ 2,500.00</td>
                                        <td>1</td>
                                        <td>₹ 2,500.00</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="voucher-footer-grid mt-4">
                                <div className="notes-section">
                                    <label className="form-label">Notes</label>
                                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[80px]">No additional notes provided.</p>
                                </div>
                                <div className="totals-section">
                                    <div className="total-row grand-total">
                                        <span>Total</span>
                                        <span>{selectedVoucher?.amount}</span>
                                    </div>
                                    {signature && (
                                        <div className="view-signature mt-4">
                                            <label className="signature-label text-xs">AUTHORIZED SIGNATURE</label>
                                            <img src={signature} alt="Signature" style={{ maxHeight: '60px', marginTop: '5px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
                            <button className="btn-submit" style={{ backgroundColor: '#4dd0e1' }} onClick={() => { setShowViewModal(false); setShowEditModal(true); }}>Edit Voucher</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Voucher</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete voucher <strong>{selectedVoucher?.voucherNo}</strong>?</p>
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

export default CreateVoucher;
