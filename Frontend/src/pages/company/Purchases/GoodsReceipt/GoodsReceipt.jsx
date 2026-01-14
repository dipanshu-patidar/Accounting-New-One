import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import '../Purchases.css';

const GoodsReceipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const sourceData = location.state?.sourceData; // content from PO

    // --- State Management ---
    const [grns, setGrns] = useState([
        { id: 1, grnNo: 'GRN-2024-001', poNo: 'PO-2024-001', vendor: 'Global Suppliers Ltd', date: '2024-01-20', status: 'Received', items: [] },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [creationMode, setCreationMode] = useState('linked'); // 'linked' or 'direct'
    const [showOrderSelect, setShowOrderSelect] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [companyDetails, setCompanyDetails] = useState({
        name: 'My Company', address: '123 Business Avenue', email: 'info@mycompany.com', phone: '123-456-7890'
    });
    const [grnMeta, setGrnMeta] = useState({
        manualNo: '', date: new Date().toISOString().split('T')[0], challanNo: ''
    });
    const [vendor, setVendor] = useState('');
    const [items, setItems] = useState([
        { id: Date.now(), name: '', warehouse: '', orderedQty: 0, receivedQty: 1, rate: 0, total: 0 }
    ]);
    const [notes, setNotes] = useState('');

    const sampleOrders = [
        {
            id: 'PO-2024-001', vendor: 'Global Suppliers Ltd', date: '2024-01-15', items: [
                { id: 101, name: 'Office Chair', warehouse: 'Main', qty: 10, rate: 1200 },
                { id: 102, name: 'Desk Lamp', warehouse: 'Main', qty: 20, rate: 450 }
            ]
        }
    ];

    // Handle Source Data (Auto-fill from Navigation)
    useEffect(() => {
        if (sourceData && !editingId) {
            setCreationMode('linked');
            setVendor(sourceData.vendor);
            if (sourceData.items) {
                const grnItems = sourceData.items.map(item => ({
                    ...item,
                    orderedQty: item.qty,
                    receivedQty: item.qty
                }));
                setItems(grnItems);
                // Also simulate 'selectedOrder' if we have orderNo
                if (sourceData.orderNo) {
                    setSelectedOrder({ id: sourceData.orderNo, vendor: sourceData.vendor });
                }
            }
            setShowAddModal(true);
        }
    }, [sourceData, editingId]);

    const handleCreationModeToggle = (mode) => {
        setCreationMode(mode);
        if (mode === 'linked') {
            setShowOrderSelect(true);
        } else {
            resetForm();
            setCreationMode('direct'); // Ensure it stays direct
        }
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setVendor(order.vendor);
        const grnItems = order.items.map(item => ({
            ...item,
            orderedQty: item.qty,
            receivedQty: item.qty,
            rate: item.rate,
            total: item.qty * item.rate
        }));
        setItems(grnItems);
        setShowOrderSelect(false);
    };

    // --- Actions ---
    const resetForm = () => {
        setEditingId(null);
        setVendor('');
        setGrnMeta({ manualNo: '', date: new Date().toISOString().split('T')[0], challanNo: '' });
        setItems([{ id: Date.now(), name: '', warehouse: '', orderedQty: 0, receivedQty: 1, rate: 0, total: 0 }]);
        setSelectedOrder(null);
        setCreationMode('direct');
        setShowAddModal(false);
    };

    const handleAddNew = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (id) => {
        const grnToEdit = grns.find(g => g.id === id);
        if (grnToEdit) {
            setEditingId(id);
            setVendor(grnToEdit.vendor);
            if (grnToEdit.items && grnToEdit.items.length > 0) setItems(grnToEdit.items);
            setShowAddModal(true);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setGrns(grns.filter(g => g.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleSave = () => {
        const newGrn = {
            id: editingId || Date.now(),
            grnNo: editingId ? grns.find(g => g.id === editingId).grnNo : `GRN-2024-00${grns.length + 1}`,
            poNo: sourceData ? sourceData.orderNo : 'Direct',
            vendor: vendor || 'Unknown Vendor',
            date: grnMeta.date,
            status: 'Received',
            items: items
        };

        if (editingId) {
            setGrns(grns.map(g => g.id === editingId ? newGrn : g));
        } else {
            setGrns([...grns, newGrn]);
        }
        setShowAddModal(false);
    };

    const handleCreateBill = (grn) => {
        navigate('/company/purchases/bill', {
            state: {
                sourceData: {
                    vendor: grn.vendor,
                    items: grn.items,
                    // pass relevant info
                }
            }
        });
    };

    // --- Calculation Helpers ---
    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', warehouse: '', orderedQty: 0, receivedQty: 1, rate: 0, total: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                // Recalculate if needed, though GRN usually just tracks Qty
                // If we want to show value, we can use rate * receivedQty
                if (field === 'receivedQty' || field === 'rate') {
                    const qty = parseFloat(updatedItem.receivedQty) || 0;
                    const rate = parseFloat(updatedItem.rate) || 0;
                    updatedItem.total = qty * rate;
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const purchaseProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart, status: 'completed' },
        { id: 'grn', label: 'Goods Receipt', icon: Truck, status: 'active' },
        { id: 'bill', label: 'Bill', icon: Receipt, status: 'pending' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    return (
        <div className="purchase-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Goods Receipt Note (GRN)</h1>
                    <p className="page-subtitle">Track received goods against orders</p>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={18} className="mr-2" /> Create GRN
                </button>
            </div>

            <div className="process-tracker-card">
                <div className="tracker-wrapper">
                    {purchaseProcess.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className={`tracker-step ${step.status}`}>
                                <div className="step-icon-wrapper">
                                    <step.icon size={20} />
                                    {step.status === 'completed' && <CheckCircle2 className="status-badge" size={14} />}
                                    {step.status === 'active' && <Clock className="status-badge" size={14} />}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                            {index < purchaseProcess.length - 1 && (
                                <div className={`tracker-divider ${purchaseProcess[index + 1].status !== 'pending' ? 'active' : ''}`}>
                                    <ArrowRight size={16} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="table-card mt-6">
                <div className="table-container">
                    <table className="purchase-table">
                        <thead>
                            <tr>
                                <th>GRN ID</th>
                                <th>PO REF</th>
                                <th>VENDOR</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grns.map(g => (
                                <tr key={g.id}>
                                    <td className="font-bold text-blue-600">{g.grnNo}</td>
                                    <td>{g.poNo}</td>
                                    <td>{g.vendor}</td>
                                    <td>{g.date}</td>
                                    <td><span className={`status-pill ${g.status.toLowerCase()}`}>{g.status}</span></td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-action-header edit" onClick={() => handleEdit(g.id)}><Pencil size={16} /></button>
                                            <button className="btn-action-header delete" onClick={() => handleDelete(g.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Create/Edit Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="purchase-form-modal">
                        <div className="modal-header-simple">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit GRN' : 'New Goods Receipt'}</h2>
                            <button className="close-btn-simple" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-scrollable">
                            {/* Mode Selection */}
                            <div className="creation-type-selector mb-6">
                                <button
                                    className={`mode-btn ${creationMode === 'linked' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('linked')}
                                >
                                    From Purchase Order
                                </button>
                                <button
                                    className={`mode-btn ${creationMode === 'direct' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('direct')}
                                >
                                    Direct Receipt
                                </button>
                            </div>

                            {/* Order Selection List (Conditional) */}
                            {creationMode === 'linked' && showOrderSelect && !selectedOrder && (
                                <div className="order-link-container">
                                    <h3 className="text-sm font-bold mb-3 text-gray-700">Select Purchase Order</h3>
                                    <div className="order-grid">
                                        {sampleOrders.map(order => (
                                            <div key={order.id} className="order-link-card" onClick={() => handleSelectOrder(order)}>
                                                <div className="o-card-header">
                                                    <span className="o-id">{order.id}</span>
                                                    <span className="o-date">{order.date}</span>
                                                </div>
                                                <div className="o-card-body">
                                                    <span className="o-customer font-bold">{order.vendor}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-section-grid">
                                <div className="company-section">
                                    <div className="logo-upload-box">
                                        <h1 className="company-logo-text">LOGO</h1>
                                    </div>
                                    <div className="company-inputs">
                                        <input type="text" className="full-width-input" value={companyDetails.name} disabled />
                                        <input type="text" className="full-width-input" value={companyDetails.address} disabled />
                                        <input type="text" className="full-width-input" value={companyDetails.email} disabled />
                                    </div>
                                </div>
                                <div className="meta-section">
                                    <div className="meta-row">
                                        <label>GRN No.</label>
                                        <input type="text" value={editingId ? grns.find(g => g.id === editingId).grnNo : "GRN-2024-NEW"} disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Challan No</label>
                                        <input type="text" placeholder="Vendor Challan"
                                            value={grnMeta.challanNo} onChange={(e) => setGrnMeta({ ...grnMeta, challanNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Date</label>
                                        <input type="date"
                                            value={grnMeta.date} onChange={(e) => setGrnMeta({ ...grnMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="status-indicator">
                                        GOODS RECEIPT
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            <div className="vendor-section">
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Select Vendor</label>
                                    <select
                                        className="form-select-large"
                                        value={vendor}
                                        onChange={(e) => setVendor(e.target.value)}
                                        disabled={creationMode === 'linked'}
                                    >
                                        <option value="">Select Vendor...</option>
                                        <option value="Global Suppliers Ltd">Global Suppliers Ltd</option>
                                        <option value="Tech Components Inc">Tech Components Inc</option>
                                    </select>
                                </div>
                            </div>

                            {creationMode === 'linked' && selectedOrder && (
                                <div className="linked-indicator mb-6">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Truck size={16} /> Receipt for Order: <strong>{selectedOrder.id}</strong>
                                    </span>
                                    <button className="change-link-btn" onClick={() => setShowOrderSelect(true)}>Change</button>
                                </div>
                            )}

                            <div className="items-section-new">
                                <button className="btn-add-row" onClick={addItem}>
                                    <Plus size={14} /> Add Line Item
                                </button>
                                <div className="table-responsive">
                                    <table className="new-items-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30%' }}>ITEM DETAIL</th>
                                                <th style={{ width: '20%' }}>WAREHOUSE</th>
                                                <th style={{ width: '15%' }}>ORDERED</th>
                                                <th style={{ width: '15%' }}>RECEIVED</th>
                                                <th style={{ width: '20%' }}>VALUATION AMT</th>
                                                <th style={{ width: '5%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="search-input-wrapper">
                                                            <input type="text" placeholder="Search Item..."
                                                                value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                                                            <Search size={14} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input type="text" placeholder="Warehouse"
                                                            value={item.warehouse} onChange={(e) => updateItem(item.id, 'warehouse', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="qty-input disabled" value={item.orderedQty || 0} disabled />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="qty-input" value={item.receivedQty}
                                                            onChange={(e) => updateItem(item.id, 'receivedQty', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="amount-input disabled" value={(item.total || 0).toFixed(2)} disabled />
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn-delete-row" onClick={() => removeItem(item.id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="form-footer-grid">
                                <div className="notes-col">
                                    <label className="section-label">Notes</label>
                                    <textarea className="notes-area" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                </div>
                            </div>

                            <div className="thank-you-note">
                                <p>Recorded Goods Receipt</p>
                            </div>

                        </div>

                        <div className="modal-footer-simple">
                            {editingId && (
                                <button className="btn-plain text-blue-600 border-blue-200 mr-auto hover:bg-blue-50"
                                    onClick={() => handleCreateBill(grns.find(g => g.id === editingId))}>
                                    Convert to Bill
                                </button>
                            )}
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={handleSave}>{editingId ? 'Update GRN' : 'Save GRN'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-box">
                        <div className="delete-modal-header">
                            <h3 className="delete-modal-title">Delete GRN?</h3>
                            <button className="delete-close-btn" onClick={() => setShowDeleteConfirm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="delete-modal-body">
                            <p>Are you sure you want to delete this GRN? This action cannot be undone.</p>
                        </div>
                        <div className="delete-modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoodsReceipt;
