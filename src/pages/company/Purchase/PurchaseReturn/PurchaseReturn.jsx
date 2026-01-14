import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Filter, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PurchaseReturn.css';

const PurchaseReturn = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);

    // Modal Form State
    const [formData, setFormData] = useState({
        returnNo: 'PR-2026-0002AY96H9',
        vendor: '',
        invoice: '',
        date: '',
        warehouse: '',
        status: 'Pending',
        reason: '',
        manualVoucherNo: '',
        notes: '',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        ifscCode: ''
    });

    const [itemRow, setItemRow] = useState({
        product: '',
        qty: 1,
        price: 0,
        tax: 18,
        total: 0
    });

    // Mock Data
    const [returns, setReturns] = useState([
        {
            id: 1,
            refId: 'REF-001',
            returnNo: 'PR-2026-001',
            invoiceNo: 'PINV-0045',
            vendor: 'Tech Solutions Ltd',
            warehouse: 'Main Warehouse',
            date: '2026-01-14',
            amount: '1,200.00',
            status: 'Completed'
        },
        {
            id: 2,
            refId: 'REF-002',
            returnNo: 'PR-2026-002',
            invoiceNo: 'PINV-0048',
            vendor: 'Global Supplies Inc',
            warehouse: 'North Branch',
            date: '2026-01-13',
            amount: '450.50',
            status: 'Pending'
        }
    ]);

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'pr-status-completed';
            case 'pending': return 'pr-status-pending';
            case 'rejected': return 'pr-status-rejected';
            default: return 'pr-status-default';
        }
    };

    return (
        <div className="purchase-return-page">
            <div className="page-header">
                <h1 className="page-title">Purchase Returns</h1>
                <div className="header-actions">
                    <div className="header-actions">
                        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                            <Plus size={18} /> Add New Return
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-card">
                {/* Controls */}
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

                    <div className="search-actions">
                        <div className="search-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button className="btn-icon" title="Filter"><Filter size={18} /></button>
                        <button className="btn-icon" title="Export"><Download size={18} /></button>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>REF ID</th>
                                <th>RETURN #</th>
                                <th>INVOICE #</th>
                                <th>VENDOR</th>
                                <th>WAREHOUSE</th>
                                <th>DATE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.map((row) => (
                                <tr key={row.id}>
                                    <td><span className="ref-id">{row.refId}</span></td>
                                    <td>{row.returnNo}</td>
                                    <td>{row.invoiceNo}</td>
                                    <td>
                                        <div className="vendor-cell">
                                            <span className="vendor-name">{row.vendor}</span>
                                        </div>
                                    </td>
                                    <td>{row.warehouse}</td>
                                    <td>{row.date}</td>
                                    <td className="amount-cell">${row.amount}</td>
                                    <td>
                                        <span className={`pr-status-badge ${getStatusClass(row.status)}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action view" title="View" onClick={() => { setSelectedReturn(row); setIsViewModalOpen(true); }}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="btn-action edit" title="Edit" onClick={() => { setSelectedReturn(row); setIsEditModalOpen(true); }}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn-action delete" title="Delete" onClick={() => { setSelectedReturn(row); setIsDeleteModalOpen(true); }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-row">
                    <div className="pagination-info">
                        Showing 1 to {returns.length} of {returns.length} entries
                    </div>
                    <div className="pagination-controls">
                        <button className="pr-page-btn disabled">Previous</button>
                        <button className="pr-page-btn active">1</button>
                        <button className="pr-page-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add New Return Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal">
                        <div className="modal-header">
                            <h2>Add New Purchase Return</h2>
                            <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {/* Form content same as before, just ensuring controlled inputs if needed */}
                            <div className="form-group full-width">
                                <label>Return No</label>
                                <input
                                    type="text"
                                    value={formData.returnNo}
                                    readOnly
                                    className="readonly-input bg-gray"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vendor <span className="text-red">*</span></label>
                                    <input type="text" placeholder="Select or type vendor..." />
                                </div>
                                <div className="form-group">
                                    <label>Invoice <span className="text-red">*</span></label>
                                    <input type="text" placeholder="" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date <span className="text-red">*</span></label>
                                    <input type="date" />
                                </div>
                                <div className="form-group">
                                    <label>Warehouse <span className="text-red">*</span></label>
                                    <input type="text" placeholder="Select or type warehouse" />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select defaultValue="Pending">
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Reason for Return</label>
                                    <input type="text" />
                                </div>
                                <div className="form-group">
                                    <label>Manual Voucher No</label>
                                    <input type="text" />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Notes</label>
                                <textarea rows="3"></textarea>
                            </div>

                            <h3 className="section-title-sm">Bank Details (Optional)</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <input type="text" placeholder="Bank Name" />
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="Account Number" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input type="text" placeholder="Account Holder" />
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="IFSC Code" />
                                </div>
                            </div>

                            <h3 className="section-title-sm">Add Returned Items</h3>
                            <div className="item-input-row">
                                <input type="text" placeholder="Select or type product" className="item-product" />
                                <input type="number" placeholder="1" className="item-qty" />
                                <input type="number" placeholder="0" className="item-price" />
                                <input type="number" placeholder="18" className="item-tax" />
                                <input type="number" placeholder="0" className="item-total" />
                                <button className="btn-add-item"><Plus size={18} /></button>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                            <button className="btn-create">Create Return</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Return Modal */}
            {isEditModalOpen && selectedReturn && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal">
                        <div className="modal-header">
                            <h2>Edit Purchase Return</h2>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label>Return No</label>
                                <input
                                    type="text"
                                    defaultValue={selectedReturn.returnNo}
                                    readOnly
                                    className="readonly-input bg-gray"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vendor <span className="text-red">*</span></label>
                                    <input type="text" defaultValue={selectedReturn.vendor} />
                                </div>
                                <div className="form-group">
                                    <label>Invoice <span className="text-red">*</span></label>
                                    <input type="text" defaultValue={selectedReturn.invoiceNo} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date <span className="text-red">*</span></label>
                                    <input type="date" defaultValue={selectedReturn.date} />
                                </div>
                                <div className="form-group">
                                    <label>Warehouse <span className="text-red">*</span></label>
                                    <input type="text" defaultValue={selectedReturn.warehouse} />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select defaultValue={selectedReturn.status}>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Notes</label>
                                <textarea rows="3" defaultValue="Returned due to damage"></textarea>
                            </div>

                            <h3 className="section-title-sm">Returned Items</h3>
                            <div className="item-input-row">
                                <input type="text" defaultValue="Example Product" className="item-product" />
                                <input type="number" defaultValue="1" className="item-qty" />
                                <input type="number" defaultValue="100" className="item-price" />
                                <input type="number" defaultValue="18" className="item-tax" />
                                <input type="number" defaultValue="118" className="item-total" />
                                <button className="btn-add-item"><Plus size={18} /></button>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                            <button className="btn-create">Update Return</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Return Modal */}
            {isViewModalOpen && selectedReturn && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal">
                        <div className="modal-header">
                            <h2>View Purchase Return</h2>
                            <button className="close-btn" onClick={() => setIsViewModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label>Return No</label>
                                <input
                                    type="text"
                                    value={selectedReturn.returnNo}
                                    readOnly
                                    className="readonly-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vendor</label>
                                    <input
                                        type="text"
                                        value={selectedReturn.vendor}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Invoice</label>
                                    <input
                                        type="text"
                                        value={selectedReturn.invoiceNo}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="text"
                                        value={selectedReturn.date}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Warehouse</label>
                                    <input
                                        type="text"
                                        value={selectedReturn.warehouse}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Notes</label>
                                <input
                                    type="text"
                                    value="No notes available."
                                    readOnly
                                />
                            </div>

                        </div>
                        <div className="modal-footer with-status">
                            <span className={`pr-status-badge ${getStatusClass(selectedReturn.status)}`}>
                                {selectedReturn.status}
                            </span>
                            <button className="btn-cancel" onClick={() => setIsViewModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedReturn && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="modal-header">
                            <h2>Delete Return</h2>
                            <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete return <strong>{selectedReturn.returnNo}</strong>?</p>
                            <p className="text-red warning-text">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="btn-delete-confirm">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseReturn;
