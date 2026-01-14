import React, { useState } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer,
    Link, FileSearch
} from 'lucide-react';
import './Invoice.css';

const Invoice = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [creationMode, setCreationMode] = useState('direct'); // 'direct', 'from_quote', 'from_order'
    const [showSourceSelect, setShowSourceSelect] = useState(false);
    const [selectedSource, setSelectedSource] = useState(null);

    const [customer, setCustomer] = useState('');
    const [items, setItems] = useState([{ id: 1, name: '', qty: 1, rate: 0, tax: 0, total: 0 }]);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');

    const salesProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'sales-order', label: 'Sales Order', icon: ShoppingCart, status: 'completed' },
        { id: 'delivery', label: 'Delivery', icon: Truck, status: 'completed' },
        { id: 'invoice', label: 'Invoice', icon: Receipt, status: 'active' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    const sampleQuotes = [
        { id: 'QUO-2024-001', customer: 'Acme Corp', date: '2024-01-10', items: [{ id: 101, name: 'Web Dev Package', qty: 1, rate: 3000, tax: 18, total: 3540 }] }
    ];

    const sampleOrders = [
        { id: 'SO-2024-001', customer: 'Global Tech', date: '2024-01-15', items: [{ id: 103, name: 'Cloud Server', qty: 12, rate: 200, tax: 5, total: 2520 }] }
    ];

    const handleCreationModeToggle = (mode) => {
        setCreationMode(mode);
        if (mode !== 'direct') {
            setShowSourceSelect(true);
        } else {
            setSelectedSource(null);
            setCustomer('');
            setItems([{ id: 1, name: '', qty: 1, rate: 0, tax: 0, total: 0 }]);
        }
    };

    const handleSelectSource = (source) => {
        setSelectedSource(source);
        setCustomer(source.customer);
        setItems(source.items.map(item => ({ ...item })));
        setShowSourceSelect(false);
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
        <div className="invoice-page">
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Invoice</h1>
                    <p className="page-subtitle">Create and send invoices to customers</p>
                </div>
                <div className="header-actions">
                    <button className="btn-add" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} className="mr-2" /> New Invoice
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
                        <input type="text" placeholder="Search invoices..." className="search-input" />
                    </div>
                </div>

                <div className="table-container">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>INVOICE #</th>
                                <th>CUSTOMER</th>
                                <th>DATE</th>
                                <th>DUE DATE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-bold text-blue-600">INV-2024-001</td>
                                <td>Acme Corp</td>
                                <td>Jan 20, 2024</td>
                                <td>Feb 20, 2024</td>
                                <td className="font-bold">$4,720.00</td>
                                <td><span className="status-pill due">Unpaid</span></td>
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

            {/* Create Invoice Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content invoice-modal">
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Create New Invoice</h2>
                                <p className="modal-subtitle">Generate official invoice for payment</p>
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
                                    Direct
                                </button>
                                <button
                                    className={`mode-btn ${creationMode === 'from_quote' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('from_quote')}
                                >
                                    From Quote
                                </button>
                                <button
                                    className={`mode-btn ${creationMode === 'from_order' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('from_order')}
                                >
                                    From Order
                                </button>
                            </div>

                            {/* Source Selection Lists */}
                            {showSourceSelect && !selectedSource && (
                                <div className="source-link-container">
                                    <h3 className="text-sm font-bold mb-3 text-gray-700">
                                        Select {creationMode === 'from_quote' ? 'Quotation' : 'Sales Order'}
                                    </h3>
                                    <div className="source-grid">
                                        {(creationMode === 'from_quote' ? sampleQuotes : sampleOrders).map(item => (
                                            <div key={item.id} className="source-link-card" onClick={() => handleSelectSource(item)}>
                                                <div className="s-card-header">
                                                    <span className="s-id">{item.id}</span>
                                                    <span className="s-date">{item.date}</span>
                                                </div>
                                                <div className="s-card-body">
                                                    <span className="s-customer">{item.customer}</span>
                                                    <span className="s-items font-bold text-green-600">${item.items.reduce((a, b) => a + b.total, 0)}</span>
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
                                            disabled={creationMode !== 'direct'}
                                        >
                                            <option value="">Select Customer</option>
                                            <option value="Acme Corp">Acme Corp</option>
                                            <option value="Global Tech">Global Tech</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Invoice Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={invoiceDate}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Due Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {selectedSource && (
                                    <div className="linked-indicator mb-4">
                                        <Link size={14} /> Linked to <strong>{selectedSource.id}</strong>
                                        <button className="change-link-btn" onClick={() => setShowSourceSelect(true)}>Change</button>
                                    </div>
                                )}

                                {/* Items Table */}
                                <div className="items-section mt-8">
                                    <div className="section-header">
                                        <h3 className="section-title">Invoice Items</h3>
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
                                                                disabled={creationMode !== 'direct'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="table-input"
                                                                value={item.qty}
                                                                onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                                                disabled={creationMode !== 'direct'}
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
                                                                    disabled={creationMode !== 'direct'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="table-input"
                                                                value={item.tax}
                                                                onChange={(e) => updateItem(item.id, 'tax', e.target.value)}
                                                                disabled={creationMode !== 'direct'}
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

                                {/* Summary */}
                                <div className="order-summary mt-8">
                                    <div className="summary-col">
                                        <div className="form-group">
                                            <label className="form-label">Payment Terms</label>
                                            <textarea className="form-textarea" placeholder="Net 30, etc..."></textarea>
                                        </div>
                                    </div>
                                    <div className="summary-col-calc">
                                        <div className="calc-row">
                                            <span>Sub Total</span>
                                            <span>${(calculateGrandTotal() * 0.82).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="calc-row">
                                            <span>Tax Total (18%)</span>
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
                                    <Printer size={16} /> Print
                                </button>
                                <button className="btn-secondary ml-2">
                                    <Send size={16} /> Send
                                </button>
                            </div>
                            <div className="footer-right">
                                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Create Invoice</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoice;
