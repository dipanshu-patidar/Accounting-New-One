import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import '../Purchases.css';

const PurchaseOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const sourceData = location.state?.sourceData; // content from Quotation if applicable

    // --- State Management ---
    const [orders, setOrders] = useState([
        { id: 1, orderNo: 'PO-2024-001', vendor: 'Global Suppliers Ltd', date: '2024-01-15', deliveryDate: '2024-01-25', amount: 5000.00, status: 'Pending', items: [] },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [companyDetails, setCompanyDetails] = useState({
        name: 'My Company', address: '123 Business Avenue', email: 'info@mycompany.com', phone: '123-456-7890'
    });
    const [orderMeta, setOrderMeta] = useState({
        manualNo: '', date: new Date().toISOString().split('T')[0], deliveryDate: ''
    });
    const [vendor, setVendor] = useState('');
    const [vendorDetails, setVendorDetails] = useState({ address: '', email: '', phone: '' });
    const [items, setItems] = useState([
        { id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }
    ]);
    const [notes, setNotes] = useState('');
    const [terms, setTerms] = useState('"Payment is due within 15 days.",\n"Goods once sold will not be taken back."');

    // Handle Source Data (Auto-fill)
    useEffect(() => {
        if (sourceData && !editingId) {
            // Auto-fill from Quotation
            setVendor(sourceData.vendor);
            if (sourceData.items) setItems(sourceData.items);
            if (sourceData.amount) {
                // validation or logic if needed
            }
            setShowAddModal(true);
            // reset state to avoid re-triggering on close/re-open if not handled
        }
    }, [sourceData, editingId]);

    // --- Actions ---
    const resetForm = () => {
        setEditingId(null);
        setVendor('');
        setVendorDetails({ address: '', email: '', phone: '' });
        setOrderMeta({ manualNo: '', date: new Date().toISOString().split('T')[0], deliveryDate: '' });
        setItems([{ id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }]);
        setShowAddModal(false);
    };

    const handleAddNew = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (id) => {
        const orderToEdit = orders.find(o => o.id === id);
        if (orderToEdit) {
            setEditingId(id);
            setVendor(orderToEdit.vendor);
            if (orderToEdit.items && orderToEdit.items.length > 0) setItems(orderToEdit.items);
            setShowAddModal(true);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setOrders(orders.filter(o => o.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleCreateGRN = (order) => {
        navigate('/company/purchases/receipt', {
            state: {
                sourceData: {
                    vendor: order.vendor,
                    items: order.items,
                    orderNo: order.orderNo
                }
            }
        });
    };

    const handleCreateBill = (order) => {
        navigate('/company/purchases/bill', {
            state: {
                sourceData: {
                    vendor: order.vendor,
                    items: order.items,
                    orderNo: order.orderNo
                }
            }
        });
    };

    const handleSave = () => {
        const totals = calculateTotals();
        const newOrder = {
            id: editingId || Date.now(),
            orderNo: editingId ? orders.find(o => o.id === editingId).orderNo : `PO-2024-00${orders.length + 1}`,
            vendor: vendor || 'Unknown Vendor',
            date: orderMeta.date,
            deliveryDate: orderMeta.deliveryDate,
            amount: totals.total,
            status: 'Pending',
            items: items
        };

        if (editingId) {
            setOrders(orders.map(o => o.id === editingId ? newOrder : o));
        } else {
            setOrders([...orders, newOrder]);
        }
        setShowAddModal(false);
    };

    // --- Calculation Helpers ---
    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }]);
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
                if (['qty', 'rate', 'tax', 'discount'].includes(field)) {
                    const qty = parseFloat(updatedItem.qty) || 0;
                    const rate = parseFloat(updatedItem.rate) || 0;
                    const tax = parseFloat(updatedItem.tax) || 0;
                    const discount = parseFloat(updatedItem.discount) || 0;

                    const subtotal = qty * rate;
                    const discountAmount = discount;
                    const taxable = subtotal - discountAmount;
                    const taxAmount = (taxable * tax) / 100;

                    updatedItem.total = taxable + taxAmount;
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const calculateTotals = () => {
        return items.reduce((acc, item) => {
            const qty = parseFloat(item.qty) || 0;
            const rate = parseFloat(item.rate) || 0;
            const discount = parseFloat(item.discount) || 0;
            const subtotal = qty * rate;

            acc.subTotal += subtotal;
            acc.discount += discount;
            acc.total += item.total;
            acc.tax += (item.total - (subtotal - discount));
            return acc;
        }, { subTotal: 0, tax: 0, discount: 0, total: 0 });
    };

    const totals = calculateTotals();

    const purchaseProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart, status: 'active' },
        { id: 'grn', label: 'Goods Receipt', icon: Truck, status: 'pending' },
        { id: 'bill', label: 'Bill', icon: Receipt, status: 'pending' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    // If direct creation (no sourceData), Quotation step is skipped/not relevant? 
    // Or we keep it as "Direct Manual Product Selection".
    // The UI Process Indicator should reflect the current stage.

    return (
        <div className="purchase-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Purchase Order</h1>
                    <p className="page-subtitle">Manage purchase orders to vendors</p>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={18} className="mr-2" /> Create Order
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
                                <th>ORDER ID</th>
                                <th>VENDOR</th>
                                <th>DATE</th>
                                <th>DELIVERY DATE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td className="font-bold text-blue-600">{o.orderNo}</td>
                                    <td>{o.vendor}</td>
                                    <td>{o.date}</td>
                                    <td>{o.deliveryDate}</td>
                                    <td>${o.amount.toFixed(2)}</td>
                                    <td><span className={`status-pill ${o.status.toLowerCase()}`}>{o.status}</span></td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-action-header edit" onClick={() => handleEdit(o.id)}><Pencil size={16} /></button>
                                            <button className="btn-action-header delete" onClick={() => handleDelete(o.id)}><Trash2 size={16} /></button>
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
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Purchase Order' : 'New Purchase Order'}</h2>
                            <button className="close-btn-simple" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-scrollable">
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
                                        <label>PO No.</label>
                                        <input type="text" value={editingId ? orders.find(o => o.id === editingId).orderNo : "PO-2024-NEW"} disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Manual Ref</label>
                                        <input type="text" placeholder="e.g. REF-001"
                                            value={orderMeta.manualNo} onChange={(e) => setOrderMeta({ ...orderMeta, manualNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Date</label>
                                        <input type="date"
                                            value={orderMeta.date} onChange={(e) => setOrderMeta({ ...orderMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Delivery Date</label>
                                        <input type="date"
                                            value={orderMeta.deliveryDate} onChange={(e) => setOrderMeta({ ...orderMeta, deliveryDate: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="status-indicator">
                                        PURCHASE ORDER
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            <div className="vendor-section">
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Select Vendor</label>
                                    <select className="form-select-large" value={vendor} onChange={(e) => setVendor(e.target.value)} disabled={!!sourceData}>
                                        <option value="">Select Vendor...</option>
                                        <option value="Global Suppliers Ltd">Global Suppliers Ltd</option>
                                        <option value="Tech Components Inc">Tech Components Inc</option>
                                    </select>
                                </div>
                                <div className="vendor-details-grid">
                                    <input type="text" placeholder="Vendor Address" className="detail-input"
                                        value={vendorDetails.address} onChange={(e) => setVendorDetails({ ...vendorDetails, address: e.target.value })} />
                                    <input type="email" placeholder="Email Address" className="detail-input"
                                        value={vendorDetails.email} onChange={(e) => setVendorDetails({ ...vendorDetails, email: e.target.value })} />
                                    <input type="tel" placeholder="Phone Number" className="detail-input"
                                        value={vendorDetails.phone} onChange={(e) => setVendorDetails({ ...vendorDetails, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="items-section-new">
                                <button className="btn-add-row" onClick={addItem}>
                                    <Plus size={14} /> Add Line Item
                                </button>
                                <div className="table-responsive">
                                    <table className="new-items-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '25%' }}>ITEM DETAIL</th>
                                                <th style={{ width: '15%' }}>WAREHOUSE</th>
                                                <th style={{ width: '10%' }}>QTY</th>
                                                <th style={{ width: '12%' }}>RATE</th>
                                                <th style={{ width: '10%' }}>TAX %</th>
                                                <th style={{ width: '10%' }}>DISC.</th>
                                                <th style={{ width: '12%' }}>AMOUNT</th>
                                                <th style={{ width: '6%' }}></th>
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
                                                        <input type="number" className="qty-input" value={item.qty}
                                                            onChange={(e) => updateItem(item.id, 'qty', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="rate-input" value={item.rate}
                                                            onChange={(e) => updateItem(item.id, 'rate', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="tax-input" value={item.tax}
                                                            onChange={(e) => updateItem(item.id, 'tax', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="discount-input" value={item.discount}
                                                            onChange={(e) => updateItem(item.id, 'discount', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="amount-input disabled" value={item.total.toFixed(2)} disabled />
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

                            <div className="totals-layout">
                                <div className="totals-spacer"></div>
                                <div className="totals-box">
                                    <div className="t-row">
                                        <span>Sub Total:</span>
                                        <span>${totals.subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="t-row">
                                        <span>Discount:</span>
                                        <span className="text-red-500">-${totals.discount.toFixed(2)}</span>
                                    </div>
                                    <div className="t-row">
                                        <span>Tax Total:</span>
                                        <span>${totals.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="t-row total">
                                        <span>Grand Total:</span>
                                        <span>${totals.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-footer-grid">
                                <div className="notes-col">
                                    <label className="section-label">Notes</label>
                                    <textarea className="notes-area" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                </div>
                                <div className="terms-col">
                                    <label className="section-label">Terms & Conditions</label>
                                    <textarea className="terms-area" value={terms} onChange={(e) => setTerms(e.target.value)} />
                                </div>
                            </div>

                            <div className="thank-you-note">
                                <p>Thank you for your business!</p>
                            </div>

                        </div>

                        <div className="modal-footer-simple">
                            {editingId && (
                                <>
                                    <button className="btn-plain text-blue-600 border-blue-200 mr-2 hover:bg-blue-50"
                                        onClick={() => handleCreateGRN(orders.find(o => o.id === editingId))}>
                                        Convert to GRN
                                    </button>
                                    <button className="btn-plain text-blue-600 border-blue-200 mr-auto hover:bg-blue-50"
                                        onClick={() => handleCreateBill(orders.find(o => o.id === editingId))}>
                                        Convert to Bill
                                    </button>
                                </>
                            )}
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={handleSave}>{editingId ? 'Update Order' : 'Save Order'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-box">
                        <div className="delete-modal-header">
                            <h3 className="delete-modal-title">Delete Order?</h3>
                            <button className="delete-close-btn" onClick={() => setShowDeleteConfirm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="delete-modal-body">
                            <p>Are you sure you want to delete this order? This action cannot be undone.</p>
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

export default PurchaseOrder;
