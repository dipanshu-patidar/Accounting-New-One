import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import '../Purchases.css';

const PurchaseBill = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const sourceData = location.state?.sourceData; // content from Quotation/PO/GRN

    // --- State Management ---
    const [bills, setBills] = useState([
        { id: 1, billNo: 'BILL-2024-001', vendor: 'Global Suppliers Ltd', date: '2024-01-22', dueDate: '2024-02-05', amount: 5000.00, status: 'Unpaid', items: [] },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [companyDetails, setCompanyDetails] = useState({
        name: 'My Company', address: '123 Business Avenue', email: 'info@mycompany.com', phone: '123-456-7890'
    });
    const [billMeta, setBillMeta] = useState({
        manualNo: '', date: new Date().toISOString().split('T')[0], dueDate: ''
    });
    const [vendor, setVendor] = useState('');
    const [items, setItems] = useState([
        { id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }
    ]);
    const [notes, setNotes] = useState('');

    // Handle Source Data (Auto-fill)
    useEffect(() => {
        if (sourceData && !editingId) {
            setVendor(sourceData.vendor);
            if (sourceData.items) {
                // Map items. For GRN, we might use receivedQty as qty
                const billItems = sourceData.items.map(item => ({
                    ...item,
                    qty: item.receivedQty || item.qty, // Prioritize receivedQty if from GRN
                    // Recalculate total if needed ensuring data integrity
                }));
                setItems(billItems);
            }
            setShowAddModal(true);
        }
    }, [sourceData, editingId]);

    // --- Actions ---
    const resetForm = () => {
        setEditingId(null);
        setVendor('');
        setBillMeta({ manualNo: '', date: new Date().toISOString().split('T')[0], dueDate: '' });
        setItems([{ id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }]);
        setShowAddModal(false);
    };

    const handleAddNew = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (id) => {
        const billToEdit = bills.find(b => b.id === id);
        if (billToEdit) {
            setEditingId(id);
            setVendor(billToEdit.vendor);
            if (billToEdit.items && billToEdit.items.length > 0) setItems(billToEdit.items);
            setShowAddModal(true);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setBills(bills.filter(b => b.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleSave = () => {
        const totals = calculateTotals();
        const newBill = {
            id: editingId || Date.now(),
            billNo: editingId ? bills.find(b => b.id === editingId).billNo : `BILL-2024-00${bills.length + 1}`,
            vendor: vendor || 'Unknown Vendor',
            date: billMeta.date,
            dueDate: billMeta.dueDate,
            amount: totals.total,
            status: 'Unpaid',
            items: items
        };

        if (editingId) {
            setBills(bills.map(b => b.id === editingId ? newBill : b));
        } else {
            setBills([...bills, newBill]);
        }
        setShowAddModal(false);
    };

    const handleMakePayment = (bill) => {
        navigate('/company/purchases/payment', {
            state: {
                sourceData: {
                    vendor: bill.vendor,
                    amount: bill.amount,
                    billNo: bill.billNo
                }
            }
        });
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
        { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart, status: 'completed' },
        { id: 'grn', label: 'Goods Receipt', icon: Truck, status: 'completed' },
        { id: 'bill', label: 'Bill', icon: Receipt, status: 'active' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    return (
        <div className="purchase-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Purchase Bill</h1>
                    <p className="page-subtitle">Record vendor bills and invoices</p>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={18} className="mr-2" /> Create Bill
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
                                <th>BILL ID</th>
                                <th>VENDOR</th>
                                <th>DATE</th>
                                <th>DUE DATE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map(b => (
                                <tr key={b.id}>
                                    <td className="font-bold text-blue-600">{b.billNo}</td>
                                    <td>{b.vendor}</td>
                                    <td>{b.date}</td>
                                    <td>{b.dueDate}</td>
                                    <td>${b.amount.toFixed(2)}</td>
                                    <td><span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span></td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-action-header edit" onClick={() => handleEdit(b.id)}><Pencil size={16} /></button>
                                            <button className="btn-action-header delete" onClick={() => handleDelete(b.id)}><Trash2 size={16} /></button>
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
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Bill' : 'New Purchase Bill'}</h2>
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
                                        <label>Bill No.</label>
                                        <input type="text" value={editingId ? bills.find(b => b.id === editingId).billNo : "BILL-2024-NEW"} disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Manual Ref</label>
                                        <input type="text" placeholder="e.g. INV-123"
                                            value={billMeta.manualNo} onChange={(e) => setBillMeta({ ...billMeta, manualNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Date</label>
                                        <input type="date"
                                            value={billMeta.date} onChange={(e) => setBillMeta({ ...billMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Due Date</label>
                                        <input type="date"
                                            value={billMeta.dueDate} onChange={(e) => setBillMeta({ ...billMeta, dueDate: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="status-indicator">
                                        PURCHASE BILL
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
                            </div>

                            <div className="thank-you-note">
                                <p>Thank you for your business!</p>
                            </div>

                        </div>

                        <div className="modal-footer-simple">
                            {editingId && (
                                <button className="btn-plain text-blue-600 border-blue-200 mr-auto hover:bg-blue-50"
                                    onClick={() => handleMakePayment(bills.find(b => b.id === editingId))}>
                                    Make Payment
                                </button>
                            )}
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={handleSave}>{editingId ? 'Update Bill' : 'Save Bill'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-box">
                        <div className="delete-modal-header">
                            <h3 className="delete-modal-title">Delete Bill?</h3>
                            <button className="delete-close-btn" onClick={() => setShowDeleteConfirm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="delete-modal-body">
                            <p>Are you sure you want to delete this bill? This action cannot be undone.</p>
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

export default PurchaseBill;
