import React, { useState } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer,
    FileSearch
} from 'lucide-react';
import './SalesOrder.css';

const SalesOrder = () => {
    // --- State Management ---
    const [salesOrders, setSalesOrders] = useState([
        { id: 1, orderNo: 'SO-2024-001', customer: 'Acme Corp', source: 'Quotation', date: '2024-01-15', amount: 4720.00, status: 'Confirmed', items: [] },
        { id: 2, orderNo: 'SO-2024-002', customer: 'Global Tech', source: 'Direct', date: '2024-01-18', amount: 1200.00, status: 'Pending', items: [] },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [creationMode, setCreationMode] = useState('direct'); // 'direct' or 'linked'
    const [showQuotationSelect, setShowQuotationSelect] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    // Form State
    const [companyDetails, setCompanyDetails] = useState({
        name: 'Zirak Books', address: '123 Business Avenue, Suite 404', email: 'info@zirakbooks.com', phone: '123-456-7890'
    });
    const [orderMeta, setOrderMeta] = useState({
        manualNo: '', date: new Date().toISOString().split('T')[0], deliveryDate: ''
    });
    const [customer, setCustomer] = useState('');
    const [customerDetails, setCustomerDetails] = useState({ address: '', email: '', phone: '' });
    const [items, setItems] = useState([
        { id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }
    ]);
    const [notes, setNotes] = useState('');
    const [terms, setTerms] = useState('');

    const salesProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'sales-order', label: 'Sales Order', icon: ShoppingCart, status: 'active' },
        { id: 'delivery', label: 'Delivery', icon: Truck, status: 'pending' },
        { id: 'invoice', label: 'Invoice', icon: Receipt, status: 'pending' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    const sampleQuotations = [
        {
            id: 'QUO-2024-001', customer: 'Acme Corp', date: '2024-01-10', items: [
                { id: 101, name: 'Web Dev Package', warehouse: 'Main', qty: 1, rate: 3000, tax: 18, discount: 0, total: 3540 },
                { id: 102, name: 'SEO Setup', warehouse: 'Service', qty: 1, rate: 1000, tax: 18, discount: 0, total: 1180 }
            ]
        }
    ];

    // --- Actions ---
    const resetForm = () => {
        setEditingId(null);
        setSelectedQuotation(null);
        setCustomer('');
        setCustomerDetails({ address: '', email: '', phone: '' });
        setItems([{ id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }]);
        setOrderMeta({ manualNo: '', date: new Date().toISOString().split('T')[0], deliveryDate: '' });
        setCreationMode('direct');
        setShowAddModal(false);
    };

    const handleAddNew = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (id) => {
        const orderToEdit = salesOrders.find(o => o.id === id);
        if (orderToEdit) {
            setEditingId(id);
            setCustomer(orderToEdit.customer);
            setCreationMode(orderToEdit.source === 'Quotation' ? 'linked' : 'direct');
            // Populate other fields as needed
            if (orderToEdit.items && orderToEdit.items.length > 0) setItems(orderToEdit.items);
            setShowAddModal(true);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setSalesOrders(salesOrders.filter(o => o.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleSave = () => {
        const totals = calculateTotals();
        const newOrder = {
            id: editingId || Date.now(),
            orderNo: editingId ? salesOrders.find(o => o.id === editingId).orderNo : `SO-2024-00${salesOrders.length + 1}`,
            customer: customer || 'Unknown Customer',
            source: creationMode === 'linked' ? 'Quotation' : 'Direct',
            date: orderMeta.date,
            amount: totals.total,
            status: 'Confirmed', // Default status for new SO
            items: items
        };

        if (editingId) {
            setSalesOrders(salesOrders.map(o => o.id === editingId ? newOrder : o));
        } else {
            setSalesOrders([...salesOrders, newOrder]);
        }
        setShowAddModal(false);
    };


    const handleCreationModeToggle = (mode) => {
        setCreationMode(mode);
        if (mode === 'linked') {
            setShowQuotationSelect(true);
        } else {
            // Reset items but keep customer info if already filled manually? 
            // Ideally reset to clean slate for direct
            if (!editingId) resetForm();
            setCreationMode('direct');
        }
    };

    const handleSelectQuotation = (quo) => {
        setSelectedQuotation(quo);
        setCustomer(quo.customer);
        setCustomerDetails({ address: '123 Acme St, Tech Park', email: 'billing@acme.com', phone: '555-0199' });
        setItems(quo.items.map(item => ({ ...item })));
        setShowQuotationSelect(false);
    };

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

    return (
        <div className="quotation-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Sales Order</h1>
                    <p className="page-subtitle">Track and confirm customer orders</p>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={18} className="mr-2" /> New Sales Order
                </button>
            </div>

            <div className="process-tracker-card">
                <div className="tracker-wrapper">
                    {salesProcess.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className={`tracker-step ${step.status}`}>
                                <div className="step-icon-wrapper">
                                    <step.icon size={20} />
                                    {step.status === 'completed' && <CheckCircle2 className="status-badge" size={14} />}
                                    {step.status === 'active' && <Clock className="status-badge" size={14} />}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                            {index < salesProcess.length - 1 && (
                                <div className={`tracker-divider ${salesProcess[index + 1].status !== 'pending' ? 'active' : ''}`}>
                                    <ArrowRight size={16} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="table-card mt-6">
                <div className="table-container">
                    <table className="quotation-table">
                        <thead>
                            <tr>
                                <th>ORDER ID</th>
                                <th>CUSTOMER</th>
                                <th>SOURCE</th>
                                <th>DATE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="font-bold text-blue-600">{order.orderNo}</td>
                                    <td>{order.customer}</td>
                                    <td><span className="source-badge">{order.source}</span></td>
                                    <td>{order.date}</td>
                                    <td className="font-bold">${order.amount.toFixed(2)}</td>
                                    <td><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-action-header edit" onClick={() => handleEdit(order.id)}><Pencil size={16} /></button>
                                            <button className="btn-action-header delete" onClick={() => handleDelete(order.id)}><Trash2 size={16} /></button>
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
                    <div className="modal-content quotation-form-modal">
                        <div className="modal-header-simple">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Sales Order' : 'New Sales Order'}</h2>
                            <button className="close-btn-simple" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-scrollable">
                            {/* Mode Selection */}
                            <div className="creation-type-selector mb-6">
                                <button
                                    className={`mode-btn ${creationMode === 'direct' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('direct')}
                                >
                                    Direct Order
                                </button>
                                <button
                                    className={`mode-btn ${creationMode === 'linked' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('linked')}
                                >
                                    From Quotation
                                </button>
                            </div>

                            {/* Quotation Selection List (Conditional) */}
                            {creationMode === 'linked' && showQuotationSelect && !selectedQuotation && (
                                <div className="quotation-link-container">
                                    <h3 className="text-sm font-bold mb-3 text-gray-700">Select Quotation</h3>
                                    <div className="quote-grid">
                                        {sampleQuotations.map(quo => (
                                            <div key={quo.id} className="quote-link-card" onClick={() => handleSelectQuotation(quo)}>
                                                <div className="q-card-header">
                                                    <span className="q-id text-blue-600 font-bold">{quo.id}</span>
                                                    <span className="q-date text-gray-400 text-xs">{quo.date}</span>
                                                </div>
                                                <div className="q-card-body mt-2">
                                                    <span className="q-customer font-semibold">{quo.customer}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top Section: Company & Document Meta */}
                            <div className="form-section-grid">
                                <div className="company-section">
                                    <div className="logo-upload-box">
                                        <h1 className="company-logo-text">BOOK</h1>
                                    </div>
                                    <div className="company-inputs">
                                        <input type="text" className="full-width-input user-editable"
                                            value={companyDetails.name} onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })} />
                                        <input type="text" className="full-width-input user-editable"
                                            value={companyDetails.address} onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })} />
                                        <input type="text" className="full-width-input user-editable"
                                            value={companyDetails.email} onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })} />
                                    </div>
                                </div>
                                <div className="meta-section">
                                    <div className="meta-row">
                                        <label>Order No.</label>
                                        <input type="text" value={editingId ? salesOrders.find(o => o.id === editingId).orderNo : "SO-2024-NEW"} disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Manual Ref</label>
                                        <input type="text" placeholder="e.g. PO-REF-001"
                                            value={orderMeta.manualNo} onChange={(e) => setOrderMeta({ ...orderMeta, manualNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Order Date</label>
                                        <input type="date"
                                            value={orderMeta.date} onChange={(e) => setOrderMeta({ ...orderMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Delivery Due</label>
                                        <input type="date"
                                            value={orderMeta.deliveryDate} onChange={(e) => setOrderMeta({ ...orderMeta, deliveryDate: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="status-indicator" style={{ color: '#3b82f6', borderColor: '#3b82f6' }}>
                                        SALES ORDER
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            {/* Customer Section */}
                            <div className="customer-section">
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Bill To</label>
                                    <select
                                        className="form-select-large"
                                        value={customer}
                                        onChange={(e) => setCustomer(e.target.value)}
                                        disabled={creationMode === 'linked'}
                                    >
                                        <option value="">Select Customer...</option>
                                        <option value="Acme Corp">Acme Corp</option>
                                        <option value="Global Tech">Global Tech</option>
                                    </select>
                                </div>
                                <div className="customer-details-grid">
                                    <input type="text" placeholder="Billing Address" className="detail-input"
                                        value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} />
                                    <input type="email" placeholder="Email Address" className="detail-input"
                                        value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} />
                                    <input type="tel" placeholder="Phone Number" className="detail-input"
                                        value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} />
                                </div>
                            </div>

                            {creationMode === 'linked' && selectedQuotation && (
                                <div className="linked-indicator mb-6">
                                    <FileSearch size={14} /> Linked to Quotation: <strong>{selectedQuotation.id}</strong>
                                    <button className="change-link-btn" onClick={() => setShowQuotationSelect(true)}>Change</button>
                                </div>
                            )}

                            {/* Items Table */}
                            <div className="items-section-new">
                                {creationMode === 'direct' && (
                                    <button className="btn-add-row" onClick={addItem}>
                                        <Plus size={14} /> Add Line Item
                                    </button>
                                )}
                                <div className="table-responsive">
                                    <table className="new-items-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '25%' }}>ITEM NAME</th>
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
                                                        <input type="text" value={item.name} disabled={creationMode === 'linked'}
                                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                            className="full-width-input" />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={item.warehouse}
                                                            onChange={(e) => updateItem(item.id, 'warehouse', e.target.value)}
                                                            className="full-width-input" />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={item.qty} disabled={creationMode === 'linked'}
                                                            onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                                            className="qty-input" />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={item.rate} disabled={creationMode === 'linked'}
                                                            onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                                                            className="rate-input" />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={item.tax} disabled={creationMode === 'linked'}
                                                            onChange={(e) => updateItem(item.id, 'tax', e.target.value)}
                                                            className="tax-input" />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={item.discount} disabled={creationMode === 'linked'}
                                                            onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                                                            className="discount-input" />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={item.total.toFixed(2)} disabled className="amount-input disabled" />
                                                    </td>
                                                    <td className="text-center">
                                                        {creationMode === 'direct' && (
                                                            <button className="btn-delete-row" onClick={() => removeItem(item.id)}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Totals Section */}
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

                            {/* Footer Grid */}
                            <div className="form-footer-grid">
                                <div className="notes-col">
                                    <label className="section-label">Notes</label>
                                    <textarea className="notes-area h-32" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                </div>
                                <div className="terms-col">
                                    <label className="section-label">Terms & Conditions</label>
                                    <textarea className="terms-area h-32" value={terms} onChange={(e) => setTerms(e.target.value)}></textarea>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer-simple">
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={handleSave}>{editingId ? 'Update Order' : 'Confirm Order'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal - User Design Match */}
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
                            <p>Are you sure you want to delete this sales order? This action cannot be undone.</p>
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

export default SalesOrder;
