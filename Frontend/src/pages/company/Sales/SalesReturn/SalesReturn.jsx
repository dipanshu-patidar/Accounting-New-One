import React, { useState } from 'react';
import {
    Search, Plus, Filter, Download,
    Eye, Pencil, Trash2, X, AlertCircle,
    FileText, CheckCircle2, Clock,
    AlertTriangle, Calendar, User, MapPin , Printer 
} from 'lucide-react';
import './SalesReturn.css';

const SalesReturn = () => {
    // --- Mock Data ---
    const summaryCards = [
        { id: 1, label: 'Total Returns', value: '1', color: 'blue', icon: FileText },
        { id: 2, label: 'Processed', value: '0', color: 'green', icon: CheckCircle2 },
        { id: 3, label: 'Pending', value: '1', color: 'orange', icon: Clock },
        { id: 4, label: 'Total Value', value: '₹ 118', color: 'purple', icon: AlertCircle },
    ];

    const [returns, setReturns] = useState([
        {
            id: 1,
            returnNo: 'RET-001',
            manualVoucherNo: 'MV-101',
            autoVoucherNo: 'AV-2024-001',
            invoiceNo: 'INV-005',
            customer: 'Rahul Traders',
            warehouse: 'Main WH',
            date: '2025-04-12',
            items: [
                { id: 101, name: 'Bicycle Parts', qty: 2, amount: 118.00 }
            ],
            amount: 118.00,
            returnType: 'Damaged',
            reason: 'Broken',
            status: 'Pending',
            narration: 'Received broken goods'
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        manualVoucherNo: '',
        customer: '',
        returnNo: '',
        invoiceNo: '',
        date: new Date().toISOString().split('T')[0],
        returnType: 'Sales Return',
        warehouse: '',
        reason: '',
        narration: '',
        items: []
    });

    const resetForm = () => {
        setFormData({
            manualVoucherNo: '',
            customer: '',
            returnNo: '',
            invoiceNo: '',
            date: new Date().toISOString().split('T')[0],
            returnType: 'Sales Return',
            warehouse: '',
            reason: '',
            narration: '',
            items: []
        });
    }

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { id: Date.now(), name: '', qty: 1, amount: 0 }]
        });
    };

    const removeItem = (id) => {
        setFormData({
            ...formData,
            items: formData.items.filter(item => item.id !== id)
        });
    };

    // Helper for status styles
    const getStatusClass = (status) => {
        switch (status) {
            case 'Processed': return 'status-success';
            case 'Pending': return 'status-warning';
            case 'Rejected': return 'status-danger';
            default: return 'status-neutral';
        }
    };

    // --- Actions Handlers ---
    const handleAdd = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (ret) => {
        setSelectedReturn(ret);
        setFormData({
            manualVoucherNo: ret.manualVoucherNo,
            customer: ret.customer,
            returnNo: ret.returnNo,
            invoiceNo: ret.invoiceNo,
            date: ret.date,
            returnType: ret.returnType,
            warehouse: ret.warehouse,
            reason: ret.reason,
            narration: ret.narration || '',
            items: ret.items || []
        });
        setShowEditModal(true);
    };

    const handleDelete = (ret) => {
        setSelectedReturn(ret);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedReturn) {
            setReturns(returns.filter(r => r.id !== selectedReturn.id));
            setShowDeleteModal(false);
            setSelectedReturn(null);
        }
    };

    const handleView = (ret) => {
        setSelectedReturn(ret);
        setShowViewModal(true);
    };

    return (
        <div className="sales-return-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Sales Return</h1>
                    <p className="page-subtitle">Manage customer returns and credits</p>
                </div>
                <div className="header-actions">
                    <button className="btn-add" onClick={handleAdd}>
                        <Plus size={18} className="mr-2" /> CREATE RETURN
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                {summaryCards.map((card) => (
                    <div key={card.id} className={`summary-card card-${card.color}`}>
                        <div className="card-content">
                            <span className="card-label">{card.label}</span>
                            <h3 className="card-value">{card.value}</h3>
                        </div>
                        <div className={`card-icon icon-${card.color}`}>
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="table-card">
                {/* Table Controls (Search/Filter) */}
                <div className="table-controls">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search returns..." className="search-input" />
                    </div>
                    <div className="controls-right">
                        <button className="btn-outline"><Filter size={16} /> Filter</button>
                        <button className="btn-outline"><Download size={16} /> Export</button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-container">
                    <table className="sales-return-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Return No</th>
                                <th>Manual Voucher No</th>
                                <th>Auto Voucher No</th>
                                <th>Invoice No</th>
                                <th>Customer</th>
                                <th>Warehouse</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Amount (₹)</th>
                                <th>Return Type</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.map((row, index) => (
                                <tr key={row.id}>
                                    <td>{index + 1}</td>
                                    <td><span className="fw-600 text-primary">{row.returnNo}</span></td>
                                    <td>{row.manualVoucherNo}</td>
                                    <td>{row.autoVoucherNo}</td>
                                    <td>{row.invoiceNo}</td>
                                    <td className="fw-600">{row.customer}</td>
                                    <td>{row.warehouse}</td>
                                    <td>{row.date}</td>
                                    <td className="text-center">{Array.isArray(row.items) ? row.items.length : row.items}</td>
                                    <td className="fw-700">₹ {row.amount.toFixed(2)}</td>
                                    <td>{row.returnType}</td>
                                    <td><span className="reason-text">{row.reason}</span></td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(row.status)}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-icon-view" title="View" onClick={() => handleView(row)}><Eye size={16} /></button>
                                            <button className="btn-action-header edit" title="Edit" onClick={() => handleEdit(row)}><Pencil size={16} /></button>
                                            <button className="btn-action-header delete" title="Delete" onClick={() => handleDelete(row)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE RETURN MODAL */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content return-modal">
                        <div className="modal-header">
                            <h2>Add New Sales Return</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Ref ID & Manual Voucher */}
                            <div className="form-group mb-4">
                                <label>Reference ID (Auto)</label>
                                <input type="text" disabled placeholder="Assigned after save" className="form-input disabled-input" />
                            </div>

                            <div className="form-group mb-4">
                                <label>Manual Voucher No</label>
                                <input type="text" placeholder="Optional"
                                    value={formData.manualVoucherNo}
                                    onChange={(e) => setFormData({ ...formData, manualVoucherNo: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            {/* Row 1: Customer, Return No, Invoice No */}
                            <div className="form-row three-col mb-4">
                                <div className="form-group">
                                    <label>Customer <span className="text-red">*</span></label>
                                    <input type="text" placeholder="Search customer..."
                                        value={formData.customer}
                                        onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                        className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Return No <span className="text-red">*</span></label>
                                    <input type="text"
                                        value={formData.returnNo}
                                        onChange={(e) => setFormData({ ...formData, returnNo: e.target.value })}
                                        className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Invoice No <span className="text-red">*</span></label>
                                    <input type="text"
                                        value={formData.invoiceNo}
                                        onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                                        className="form-input" />
                                </div>
                            </div>

                            {/* Row 2: Date, Return Type, Warehouse */}
                            <div className="form-row three-col mb-6">
                                <div className="form-group">
                                    <label>Date <span className="text-red">*</span></label>
                                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Return Type</label>
                                    <select className="form-select" value={formData.returnType} onChange={(e) => setFormData({ ...formData, returnType: e.target.value })}>
                                        <option>Sales Return</option>
                                        <option>Damaged Goods</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Warehouse <span className="text-red">*</span></label>
                                    <input type="text" placeholder="Search warehouse..."
                                        value={formData.warehouse}
                                        onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                                        className="form-input" />
                                </div>
                            </div>

                            {/* Returned Items Section */}
                            <div className="items-section mb-6">
                                <h4 className="section-title">Returned Items</h4>
                                <button className="btn-add-item-blue" onClick={addItem}>
                                    + Add Item
                                </button>

                                {formData.items.length > 0 && (
                                    <div className="items-list mt-3">
                                        {formData.items.map((item, idx) => (
                                            <div key={item.id} className="item-row">
                                                <input type="text" placeholder="Item Name" value={item.name} className="form-input item-name" />
                                                <input type="number" placeholder="Qty" value={item.qty} className="form-input item-qty" />
                                                <button className="btn-remove-item" onClick={() => removeItem(item.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reason & Narration */}
                            <div className="form-group mb-4">
                                <label>Reason for Return</label>
                                <input type="text" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="form-input" />
                            </div>

                            <div className="form-group mb-4">
                                <label>Narration</label>
                                <textarea className="form-textarea" rows="3" value={formData.narration} onChange={(e) => setFormData({ ...formData, narration: e.target.value })}></textarea>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-submit-green">Add Return</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT RETURN MODAL */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content return-modal">
                        <div className="modal-header">
                            <h2>Edit Sales Return</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Reusing Form Structure for Edit */}
                            <div className="form-group mb-4">
                                <label>Manual Voucher No</label>
                                <input type="text" value={formData.manualVoucherNo} onChange={(e) => setFormData({ ...formData, manualVoucherNo: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-row three-col mb-4">
                                <div className="form-group"><label>Customer</label><input type="text" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} className="form-input" /></div>
                                <div className="form-group"><label>Return No</label><input type="text" value={formData.returnNo} onChange={(e) => setFormData({ ...formData, returnNo: e.target.value })} className="form-input" /></div>
                                <div className="form-group"><label>Invoice No</label><input type="text" value={formData.invoiceNo} onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })} className="form-input" /></div>
                            </div>
                            <div className="form-row three-col mb-6">
                                <div className="form-group"><label>Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="form-input" /></div>
                                <div className="form-group"><label>Return Type</label><select className="form-select" value={formData.returnType} onChange={(e) => setFormData({ ...formData, returnType: e.target.value })}><option>Sales Return</option><option>Damaged Goods</option></select></div>
                                <div className="form-group"><label>Warehouse</label><input type="text" value={formData.warehouse} onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })} className="form-input" /></div>
                            </div>
                            <div className="items-section mb-6">
                                <h4 className="section-title">Returned Items</h4>
                                <button className="btn-add-item-blue" onClick={addItem}>+ Add Item</button>
                                {formData.items.length > 0 && (
                                    <div className="items-list mt-3">
                                        {formData.items.map((item) => (
                                            <div key={item.id} className="item-row">
                                                <input type="text" value={item.name} className="form-input item-name" />
                                                <input type="number" value={item.qty} className="form-input item-qty" />
                                                <button className="btn-remove-item" onClick={() => removeItem(item.id)}><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="form-group mb-4"><label>Reason</label><input type="text" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="form-input" /></div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-submit-green" onClick={() => setShowEditModal(false)}>Update Return</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="confirmation-modal">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
                            <AlertTriangle size={48} />
                        </div>
                        <h3>Delete Return?</h3>
                        <p>Are you sure you want to delete this return? This action cannot be undone.</p>
                        <div className="confirmation-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW MODAL - Using a read-only card style */}
            {showViewModal && selectedReturn && (
                <div className="modal-overlay">
                    <div className="modal-content return-modal" style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h2>Return Details <span className="text-gray-500 text-sm">#{selectedReturn.returnNo}</span></h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-grid">
                                <div className="view-group">
                                    <label className="view-label">Customer</label>
                                    <div className="view-value flex items-center gap-2">
                                        <User size={16} className="text-blue-500" /> {selectedReturn.customer}
                                    </div>
                                </div>
                                <div className="view-group">
                                    <label className="view-label">Warehouse</label>
                                    <div className="view-value flex items-center gap-2">
                                        <MapPin size={16} className="text-orange-500" /> {selectedReturn.warehouse}
                                    </div>
                                </div>
                                <div className="view-group">
                                    <label className="view-label">Date</label>
                                    <div className="view-value flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-500" /> {selectedReturn.date}
                                    </div>
                                </div>
                                <div className="view-group">
                                    <label className="view-label">Return Type</label>
                                    <div className="view-value badge-style">{selectedReturn.returnType}</div>
                                </div>
                                <div className="view-group">
                                    <label className="view-label">Invoice Reference</label>
                                    <div className="view-value font-mono">{selectedReturn.invoiceNo}</div>
                                </div>
                                <div className="view-group">
                                    <label className="view-label">Manual Voucher</label>
                                    <div className="view-value">{selectedReturn.manualVoucherNo || '-'}</div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="section-title">Items Returned</h4>
                                <div className="view-items-table-wrapper">
                                    <table className="view-items-table">
                                        <thead>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Qty</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(selectedReturn.items) && selectedReturn.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{item.name}</td>
                                                    <td>{item.qty}</td>
                                                    <td>₹ {item.amount ? item.amount.toFixed(2) : '0.00'}</td>
                                                </tr>
                                            ))}
                                            <tr className="fw-700 bg-gray-50">
                                                <td>Total</td>
                                                <td></td>
                                                <td>₹ {selectedReturn.amount.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <label className="view-label">Reason</label>
                                <p className="text-sm text-gray-700 mt-1">{selectedReturn.reason}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
                            <button className="btn-outline flex items-center gap-2"><Printer size={16} /> Print Return</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesReturn;
