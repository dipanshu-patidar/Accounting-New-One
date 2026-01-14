import React, { useState } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer,
    FileSearch
} from 'lucide-react';
import './SalesOrder.css';

const SalesOrder = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [creationMode, setCreationMode] = useState('direct'); // 'direct' or 'linked'
    const [showQuotationSelect, setShowQuotationSelect] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    const [customer, setCustomer] = useState('');
    const [items, setItems] = useState([{ id: 1, name: '', qty: 1, rate: 0, tax: 0, total: 0 }]);
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [expectedDate, setExpectedDate] = useState('');

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
                { id: 101, name: 'Web Dev Package', qty: 1, rate: 3000, tax: 18, total: 3540 },
                { id: 102, name: 'SEO Setup', qty: 1, rate: 1000, tax: 18, total: 1180 }
            ]
        },
        {
            id: 'QUO-2024-002', customer: 'Global Tech', date: '2024-01-12', items: [
                { id: 103, name: 'Cloud Server (Monthly)', qty: 12, rate: 200, tax: 5, total: 2520 }
            ]
        }
    ];

    const handleCreationModeToggle = (mode) => {
        setCreationMode(mode);
        if (mode === 'linked') {
            setShowQuotationSelect(true);
        } else {
            setSelectedQuotation(null);
            setCustomer('');
            setItems([{ id: 1, name: '', qty: 1, rate: 0, tax: 0, total: 0 }]);
        }
    };

    const handleSelectQuotation = (quo) => {
        setSelectedQuotation(quo);
        setCustomer(quo.customer);
        setItems(quo.items.map(item => ({ ...item })));
        setShowQuotationSelect(false);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', qty: 1, rate: 0, tax: 0, total: 0 }]);
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
                if (field === 'qty' || field === 'rate' || field === 'tax') {
                    const subtotal = updatedItem.qty * (parseFloat(updatedItem.rate) || 0);
                    const taxAmount = (subtotal * (parseFloat(updatedItem.tax) || 0)) / 100;
                    updatedItem.total = subtotal + taxAmount;
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + item.total, 0);
    };

    return (
        <div className="sales-order-page">
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Sales Order</h1>
                    <p className="page-subtitle">Track and confirm customer orders</p>
                </div>
                <div className="header-actions">
                    <button className="btn-add" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} className="mr-2" /> New Sales Order
                    </button>
                </div>
            </div>

            {/* Sales Process Tracker */}
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
                <div className="table-controls">
                    <div className="search-control">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search orders..." className="search-input" />
                    </div>
                </div>

                <div className="table-container">
                    <table className="order-table">
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
                            <tr>
                                <td className="font-bold text-blue-600">SO-2024-001</td>
                                <td>Acme Corp</td>
                                <td><span className="source-badge">Quotation</span></td>
                                <td>Jan 15, 2024</td>
                                <td className="font-bold">$4,720.00</td>
                                <td><span className="status-pill active">Confirmed</span></td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="btn-icon-edit"><Pencil size={16} /></button>
                                        <button className="btn-icon-delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Sales Order Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content sales-order-modal">
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Create Sales Order</h2>
                                <p className="modal-subtitle">Direct creation or link from existing quotation</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
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
                                    <h3 className="text-sm font-bold mb-3 text-gray-700">Select Quotation to Import</h3>
                                    <div className="quote-grid">
                                        {sampleQuotations.map(quo => (
                                            <div key={quo.id} className="quote-link-card" onClick={() => handleSelectQuotation(quo)}>
                                                <div className="q-card-header">
                                                    <span className="q-id">{quo.id}</span>
                                                    <span className="q-date">{quo.date}</span>
                                                </div>
                                                <div className="q-card-body">
                                                    <span className="q-customer">{quo.customer}</span>
                                                    <span className="q-items">{quo.items.length} Items</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-container">
                                {/* Company Info - Read Only */}
                                <div className="company-info-readonly mb-6">
                                    <div className="company-brand">
                                        <div className="logo-placeholder">ZB</div>
                                        <div className="brand-details">
                                            <h4>Zirak Books</h4>
                                            <p>123 Business Avenue, Suite 404</p>
                                        </div>
                                    </div>
                                    <div className="company-meta">
                                        <p><strong>GSTIN:</strong> 27AAPCM0314L1Z3</p>
                                        <p><strong>Bank:</strong> HDFC Bank (A/C: ...5562)</p>
                                    </div>
                                </div>

                                <div className="form-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">Customer Name</label>
                                        <select
                                            className="form-input"
                                            value={customer}
                                            onChange={(e) => setCustomer(e.target.value)}
                                            disabled={creationMode === 'linked'}
                                        >
                                            <option value="">Select Customer</option>
                                            <option value="Acme Corp">Acme Corp</option>
                                            <option value="Global Tech">Global Tech</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Order Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={orderDate}
                                            onChange={(e) => setOrderDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Expected Delivery</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={expectedDate}
                                            onChange={(e) => setExpectedDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {creationMode === 'linked' && selectedQuotation && (
                                    <div className="linked-indicator mb-4">
                                        <FileSearch size={14} /> Linked to <strong>{selectedQuotation.id}</strong>
                                        <button className="change-link-btn" onClick={() => setShowQuotationSelect(true)}>Change</button>
                                    </div>
                                )}

                                {/* Items Table */}
                                <div className="items-section mt-4">
                                    <div className="section-header">
                                        <h3 className="section-title">Order Items</h3>
                                        {creationMode === 'direct' && (
                                            <button className="btn-add-sm" onClick={addItem}>
                                                <Plus size={14} /> Add Item
                                            </button>
                                        )}
                                    </div>

                                    <div className="items-table-wrapper">
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Product / Service</th>
                                                    <th style={{ width: '100px' }}>Qty</th>
                                                    <th style={{ width: '140px' }}>Rate</th>
                                                    <th style={{ width: '100px' }}>Tax (%)</th>
                                                    <th style={{ width: '140px' }}>Total</th>
                                                    <th style={{ width: '50px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="table-input"
                                                                placeholder="Enter product/service"
                                                                value={item.name}
                                                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                                disabled={creationMode === 'linked'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="table-input"
                                                                value={item.qty}
                                                                onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                                                disabled={creationMode === 'linked'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="input-with-symbol text-xs">
                                                                <span>$</span>
                                                                <input
                                                                    type="number"
                                                                    className="table-input"
                                                                    value={item.rate}
                                                                    onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                                                                    disabled={creationMode === 'linked'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="table-input"
                                                                value={item.tax}
                                                                onChange={(e) => updateItem(item.id, 'tax', e.target.value)}
                                                                disabled={creationMode === 'linked'}
                                                            />
                                                        </td>
                                                        <td className="font-bold text-gray-700">
                                                            ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td>
                                                            {creationMode === 'direct' && (
                                                                <button className="btn-remove" onClick={() => removeItem(item.id)}>
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="order-summary mt-8">
                                    <div className="summary-col">
                                        <div className="form-group">
                                            <label className="form-label">Notes / Instructions</label>
                                            <textarea className="form-textarea" placeholder="Special requirements, shipping info..."></textarea>
                                        </div>
                                    </div>
                                    <div className="summary-col-calc">
                                        <div className="calc-row">
                                            <span>Sub Total</span>
                                            <span>${(calculateGrandTotal() * 0.82).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="calc-row">
                                            <span>Sales Tax (18%)</span>
                                            <span>${(calculateGrandTotal() * 0.18).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="calc-row grand-total mt-4">
                                            <span>Grand Total</span>
                                            <span>${calculateGrandTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="footer-left">
                                <button className="btn-secondary">
                                    <Printer size={16} /> Print Order
                                </button>
                            </div>
                            <div className="footer-right">
                                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Create Sales Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesOrder;
