import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer
} from 'lucide-react';
import '../Purchases.css';

const PurchaseQuotation = () => {
    // --- State Management ---
    const [quotations, setQuotations] = useState([
        { id: 1, quotationNo: 'PQ-2024-001', vendor: 'Global Suppliers Ltd', date: '2024-01-10', validTill: '2024-01-20', amount: 5000.00, status: 'Active', items: [] },
        { id: 2, quotationNo: 'PQ-2024-002', vendor: 'Tech Components Inc', date: '2024-01-12', validTill: '2024-01-22', amount: 1200.00, status: 'Pending', items: [] },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    // Form State
    const [companyDetails, setCompanyDetails] = useState({
        name: 'My Company', address: '123 Business Avenue', email: 'info@mycompany.com', phone: '123-456-7890'
    });
    const [quotationMeta, setQuotationMeta] = useState({
        manualNo: '', date: new Date().toISOString().split('T')[0], validTill: ''
    });
    const [vendor, setVendor] = useState('');
    const [vendorDetails, setVendorDetails] = useState({ address: '', email: '', phone: '' });
    const [items, setItems] = useState([
        { id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }
    ]);
    const [notes, setNotes] = useState('');
    const [terms, setTerms] = useState('"Payment is due within 15 days.",\n"Goods once sold will not be taken back."');
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);

    // --- Actions ---
    const resetForm = () => {
        setEditingId(null);
        setVendor('');
        setVendorDetails({ address: '', email: '', phone: '' });
        setQuotationMeta({ manualNo: '', date: new Date().toISOString().split('T')[0], validTill: '' });
        setItems([{ id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }]);
        setAttachments([]);
        setShowAddModal(false);
    };

    const handleAddNew = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (id) => {
        const quoteToEdit = quotations.find(q => q.id === id);
        if (quoteToEdit) {
            setEditingId(id);
            setVendor(quoteToEdit.vendor);
            if (quoteToEdit.items && quoteToEdit.items.length > 0) setItems(quoteToEdit.items);
            setShowAddModal(true);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setQuotations(quotations.filter(q => q.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleCreateOrder = (quotation) => {
        navigate('/company/purchases/order', {
            state: {
                sourceData: {
                    vendor: quotation.vendor,
                    items: quotation.items,
                    // add other mapped fields if necessary
                }
            }
        });
    };

    const handleCreateBill = (quotation) => {
        navigate('/company/purchases/bill', {
            state: {
                sourceData: {
                    vendor: quotation.vendor,
                    items: quotation.items,
                }
            }
        });
    };

    const handleSave = () => {
        const totals = calculateTotals();
        const newQuotation = {
            id: editingId || Date.now(),
            quotationNo: editingId ? quotations.find(q => q.id === editingId).quotationNo : `PQ-2024-00${quotations.length + 1}`,
            vendor: vendor || 'Unknown Vendor',
            date: quotationMeta.date,
            validTill: quotationMeta.validTill,
            amount: totals.total,
            status: 'Active',
            items: items
        };

        if (editingId) {
            setQuotations(quotations.map(q => q.id === editingId ? newQuotation : q));
        } else {
            setQuotations([...quotations, newQuotation]);
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

    // --- Attachment Helpers ---
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setAttachments([...attachments, ...newFiles]);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removeAttachment = (indexToRemove) => {
        setAttachments(attachments.filter((_, index) => index !== indexToRemove));
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
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'active' },
        { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart, status: 'pending' },
        { id: 'grn', label: 'Goods Receipt', icon: Truck, status: 'pending' },
        { id: 'bill', label: 'Bill', icon: Receipt, status: 'pending' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    return (
        <div className="purchase-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Purchase Quotation</h1>
                    <p className="page-subtitle">Manage purchase quotations from vendors</p>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={18} className="mr-2" /> Create Quotation
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
                                <th>QUOTATION ID</th>
                                <th>VENDOR</th>
                                <th>DATE</th>
                                <th>VALID TILL</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map(q => (
                                <tr key={q.id}>
                                    <td className="font-bold text-blue-600">{q.quotationNo}</td>
                                    <td>{q.vendor}</td>
                                    <td>{q.date}</td>
                                    <td>{q.validTill}</td>
                                    <td>${q.amount.toFixed(2)}</td>
                                    <td><span className={`status-pill ${q.status.toLowerCase()}`}>{q.status}</span></td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-action-header edit" onClick={() => handleEdit(q.id)}><Pencil size={16} /></button>
                                            <button className="btn-action-header delete" onClick={() => handleDelete(q.id)}><Trash2 size={16} /></button>
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
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Purchase Quotation' : 'New Purchase Quotation'}</h2>
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
                                        <label>Quotation No.</label>
                                        <input type="text" value={editingId ? quotations.find(q => q.id === editingId).quotationNo : "PQ-2024-NEW"} disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Manual Ref</label>
                                        <input type="text" placeholder="e.g. REF-001"
                                            value={quotationMeta.manualNo} onChange={(e) => setQuotationMeta({ ...quotationMeta, manualNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Date</label>
                                        <input type="date"
                                            value={quotationMeta.date} onChange={(e) => setQuotationMeta({ ...quotationMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Valid Till</label>
                                        <input type="date"
                                            value={quotationMeta.validTill} onChange={(e) => setQuotationMeta({ ...quotationMeta, validTill: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="status-indicator">
                                        QUOTATION
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            <div className="vendor-section">
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Select Vendor</label>
                                    <select className="form-select-large" value={vendor} onChange={(e) => setVendor(e.target.value)}>
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
                                    <button className="btn-plain text-blue-600 border-blue-200 mr-auto hover:bg-blue-50"
                                        onClick={() => handleCreateOrder(quotations.find(q => q.id === editingId))}>
                                        Convert to Purchase Order
                                    </button>
                                    <button className="btn-plain text-blue-600 border-blue-200 mr-auto hover:bg-blue-50"
                                        onClick={() => handleCreateBill(quotations.find(q => q.id === editingId))}>
                                        Convert to Bill
                                    </button>
                                </>
                            )}
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={handleSave}>{editingId ? 'Update Quotation' : 'Save Quotation'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-box">
                        <div className="delete-modal-header">
                            <h3 className="delete-modal-title">Delete Quotation?</h3>
                            <button className="delete-close-btn" onClick={() => setShowDeleteConfirm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="delete-modal-body">
                            <p>Are you sure you want to delete this quotation? This action cannot be undone.</p>
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

export default PurchaseQuotation;
