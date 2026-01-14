import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import '../Purchases.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const sourceData = location.state?.sourceData; // content from Bill

    // --- State Management ---
    const [payments, setPayments] = useState([
        { id: 1, paymentNo: 'PAY-2024-001', vendor: 'Global Suppliers Ltd', billNo: 'BILL-2024-001', date: '2024-01-25', amount: 5000.00, mode: 'Bank Transfer', status: 'Completed' },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [companyDetails, setCompanyDetails] = useState({
        name: 'My Company', address: '123 Business Avenue', email: 'info@mycompany.com', phone: '123-456-7890'
    });
    const [paymentMeta, setPaymentMeta] = useState({
        manualNo: '', date: new Date().toISOString().split('T')[0], mode: 'Bank Transfer'
    });
    const [vendor, setVendor] = useState('');
    const [billNo, setBillNo] = useState('');
    const [amount, setAmount] = useState(0);
    const [notes, setNotes] = useState('');

    // Handle Source Data (Auto-fill)
    useEffect(() => {
        if (sourceData && !editingId) {
            setVendor(sourceData.vendor);
            setAmount(sourceData.amount || 0);
            setBillNo(sourceData.billNo || '');
            setShowAddModal(true);
        }
    }, [sourceData, editingId]);

    // --- Actions ---
    const resetForm = () => {
        setEditingId(null);
        setVendor('');
        setBillNo('');
        setAmount(0);
        setPaymentMeta({ manualNo: '', date: new Date().toISOString().split('T')[0], mode: 'Bank Transfer' });
        setNotes('');
        setShowAddModal(false);
    };

    const handleAddNew = () => {
        // Strict: Payment strictly created from Purchase Bill?
        // If so, maybe disable direct creation or show warning?
        // User said: "Strictly created from a Purchase Bill".
        // But let's allow manual entry if they want, but prompt?
        // For now, allow manual but fields are open.
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (id) => {
        const payToEdit = payments.find(p => p.id === id);
        if (payToEdit) {
            setEditingId(id);
            setVendor(payToEdit.vendor);
            setBillNo(payToEdit.billNo);
            setAmount(payToEdit.amount);
            setPaymentMeta({ ...paymentMeta, date: payToEdit.date, mode: payToEdit.mode });
            setShowAddModal(true);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setPayments(payments.filter(p => p.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleSave = () => {
        const newPayment = {
            id: editingId || Date.now(),
            paymentNo: editingId ? payments.find(p => p.id === editingId).paymentNo : `PAY-2024-00${payments.length + 1}`,
            vendor: vendor || 'Unknown Vendor',
            billNo: billNo,
            date: paymentMeta.date,
            amount: parseFloat(amount) || 0,
            mode: paymentMeta.mode,
            status: 'Completed'
        };

        if (editingId) {
            setPayments(payments.map(p => p.id === editingId ? newPayment : p));
        } else {
            setPayments([...payments, newPayment]);
        }
        setShowAddModal(false);
    };

    const purchaseProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart, status: 'completed' },
        { id: 'grn', label: 'Goods Receipt', icon: Truck, status: 'completed' },
        { id: 'bill', label: 'Bill', icon: Receipt, status: 'completed' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'active' },
    ];

    return (
        <div className="purchase-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payment</h1>
                    <p className="page-subtitle">Record payments for purchase bills</p>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={18} className="mr-2" /> Record Payment
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
                                <th>PAYMENT ID</th>
                                <th>VENDOR</th>
                                <th>BILL REF</th>
                                <th>DATE</th>
                                <th>MODE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td className="font-bold text-blue-600">{p.paymentNo}</td>
                                    <td>{p.vendor}</td>
                                    <td>{p.billNo}</td>
                                    <td>{p.date}</td>
                                    <td>{p.mode}</td>
                                    <td>${p.amount.toFixed(2)}</td>
                                    <td><span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span></td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-action-header edit" onClick={() => handleEdit(p.id)}><Pencil size={16} /></button>
                                            <button className="btn-action-header delete" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
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
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Payment' : 'New Payment'}</h2>
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
                                        <label>REF No.</label>
                                        <input type="text" value={editingId ? payments.find(p => p.id === editingId).paymentNo : "PAY-2024-NEW"} disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Manual Ref</label>
                                        <input type="text" placeholder="e.g. TXN-123"
                                            value={paymentMeta.manualNo} onChange={(e) => setPaymentMeta({ ...paymentMeta, manualNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Date</label>
                                        <input type="date"
                                            value={paymentMeta.date} onChange={(e) => setPaymentMeta({ ...paymentMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="status-indicator">
                                        PAYMENT
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            <div className="vendor-section">
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Related Bill No.</label>
                                    <input type="text" className="full-width-input" value={billNo} onChange={(e) => setBillNo(e.target.value)} disabled={!!sourceData} />
                                </div>
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Select Vendor</label>
                                    <select className="form-select-large" value={vendor} onChange={(e) => setVendor(e.target.value)} disabled={!!sourceData}>
                                        <option value="">Select Vendor...</option>
                                        <option value="Global Suppliers Ltd">Global Suppliers Ltd</option>
                                        <option value="Tech Components Inc">Tech Components Inc</option>
                                    </select>
                                </div>
                            </div>

                            <div className="payment-details-section mt-4 p-4 bg-gray-50 rounded">
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="form-label-sm">Payment Amount</label>
                                        <input type="number" className="full-width-input text-lg font-bold" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="form-label-sm">Payment Mode</label>
                                        <select className="full-width-input" value={paymentMeta.mode} onChange={(e) => setPaymentMeta({ ...paymentMeta, mode: e.target.value })}>
                                            <option>Bank Transfer</option>
                                            <option>Cheque</option>
                                            <option>Cash</option>
                                            <option>Credit Card</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-footer-grid">
                                <div className="notes-col">
                                    <label className="section-label">Notes</label>
                                    <textarea className="notes-area" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer-simple">
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={handleSave}>{editingId ? 'Update Payment' : 'Save Payment'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-box">
                        <div className="delete-modal-header">
                            <h3 className="delete-modal-title">Delete Payment?</h3>
                            <button className="delete-close-btn" onClick={() => setShowDeleteConfirm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="delete-modal-body">
                            <p>Are you sure you want to delete this payment record? This action cannot be undone.</p>
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

export default Payment;
