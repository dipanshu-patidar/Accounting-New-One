import React, { useState } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer
} from 'lucide-react';
import './Quotation.css';

const Quotation = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [items, setItems] = useState([{ id: 1, name: '', qty: 1, rate: 0, tax: 0, total: 0 }]);
    const [customer, setCustomer] = useState('');
    const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0]);
    const [expiryDate, setExpiryDate] = useState('');

    const salesProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'active' },
        { id: 'sales-order', label: 'Sales Order', icon: ShoppingCart, status: 'pending' },
        { id: 'delivery', label: 'Delivery', icon: Truck, status: 'pending' },
        { id: 'invoice', label: 'Invoice', icon: Receipt, status: 'pending' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

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
        <div className="quotation-page">
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Quotation</h1>
                    <p className="page-subtitle">Create and manage your price offers</p>
                </div>
                <div className="header-actions">
                    <button className="btn-add" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} className="mr-2" /> New Quotation
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
                        <input type="text" placeholder="Search quotations..." className="search-input" />
                    </div>
                </div>

                <div className="table-container">
                    <table className="quote-table">
                        <thead>
                            <tr>
                                <th>QUOTE ID</th>
                                <th>CUSTOMER</th>
                                <th>DATE</th>
                                <th>EXPIRY DATE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-bold text-blue-600">QUO-2024-001</td>
                                <td>Acme Corp</td>
                                <td>Jan 10, 2024</td>
                                <td>Jan 30, 2024</td>
                                <td className="font-bold">$5,000.00</td>
                                <td><span className="status-pill active">Sent</span></td>
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

            {/* Create Quotation Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content quotation-modal">
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Create New Quotation</h2>
                                <p className="modal-subtitle">Offer your products/services with professional design</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-container">
                                {/* Common Data - Read Only */}
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
                                        <label className="form-label">Customer Name <span className="text-red-500">*</span></label>
                                        <select
                                            className="form-input"
                                            value={customer}
                                            onChange={(e) => setCustomer(e.target.value)}
                                        >
                                            <option value="">Select Customer</option>
                                            <option value="Acme Corp">Acme Corp</option>
                                            <option value="Global Tech">Global Tech</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={quoteDate}
                                            onChange={(e) => setQuoteDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Expiry Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Items Table - Manual Selection */}
                                <div className="items-section mt-8">
                                    <div className="section-header">
                                        <h3 className="section-title">Quotation Items</h3>
                                        <button className="btn-add-sm" onClick={addItem}>
                                            <Plus size={14} /> Add Item
                                        </button>
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
                                                                placeholder="Enter product/service name"
                                                                value={item.name}
                                                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="table-input"
                                                                value={item.qty}
                                                                onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
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
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="table-input"
                                                                value={item.tax}
                                                                onChange={(e) => updateItem(item.id, 'tax', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="font-bold text-gray-700">
                                                            ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td>
                                                            <button className="btn-remove" onClick={() => removeItem(item.id)}>
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Quotation Summary */}
                                <div className="order-summary mt-8">
                                    <div className="summary-col">
                                        <div className="form-group">
                                            <label className="form-label">Terms & Conditions</label>
                                            <textarea className="form-textarea" placeholder="Payment terms, delivery info, etc..."></textarea>
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
                                    <Printer size={16} /> Print Preview
                                </button>
                                <button className="btn-secondary ml-2">
                                    <Send size={16} /> Send to Email
                                </button>
                            </div>
                            <div className="footer-right">
                                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Create Quote</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quotation;
