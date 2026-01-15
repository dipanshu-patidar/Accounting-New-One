import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer,
    Wallet
} from 'lucide-react';
import './Payment.css';
import paymentReceiptService from '../../../../services/paymentReceiptService';

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [unpaidInvoices, setUnpaidInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showInvoiceSelect, setShowInvoiceSelect] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Edit & Delete State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Payment Data
    const [customer, setCustomer] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');
    const [amountReceived, setAmountReceived] = useState(0);
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');

    const salesProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'sales-order', label: 'Sales Order', icon: ShoppingCart, status: 'completed' },
        { id: 'delivery', label: 'Delivery', icon: Truck, status: 'completed' },
        { id: 'invoice', label: 'Invoice', icon: Receipt, status: 'completed' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'active' },
    ];

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [paymentsRes, invoicesRes] = await Promise.all([
                paymentReceiptService.getPayments(),
                paymentReceiptService.getInvoicesForPayment()
            ]);
            setPayments(paymentsRes);
            setUnpaidInvoices(invoicesRes);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatPaymentMethod = (method) => {
        return method.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const handleSelectInvoice = (inv) => {
        setSelectedInvoice(inv);
        setCustomer(inv.customer?.name || '');
        setAmountReceived(inv.dueAmount); // Auto-fill with balance due
        setShowInvoiceSelect(false);
    };

    const resetForm = () => {
        setIsEditMode(false);
        setEditId(null);
        setSelectedInvoice(null);
        setCustomer('');
        setAmountReceived(0);
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setPaymentMode('BANK_TRANSFER');
        setReference('');
        setNotes('');
        setShowInvoiceSelect(false);
    };

    const handleSavePayment = async () => {
        if (!selectedInvoice) return;
        try {
            const paymentData = {
                invoiceId: selectedInvoice.id,
                paymentDate,
                amount: parseFloat(amountReceived),
                paymentMethod: paymentMode,
                referenceNumber: reference,
                notes
            };
            await paymentReceiptService.createPayment(paymentData);
            setShowAddModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error('Error creating payment:', err);
            setError(err.response?.data?.message || 'Failed to create payment');
        }
    };

    const handleOpenModal = () => {
        resetForm();
        setShowInvoiceSelect(true); // Default to showing invoice select for new payment
        setShowAddModal(true);
    };

    const handleEdit = (paymentId) => {
        resetForm();
        setIsEditMode(true);
        setEditId(paymentId);

        // Simulate fetching details
        setSelectedInvoice({ id: 'INV-2024-001', customer: 'Acme Corp', date: '2024-01-20', amount: 4720, balance: 4720 }); // Mock linked invoice
        setCustomer('Acme Corp');
        setAmountReceived(4720);
        setPaymentDate('2024-01-25');
        setPaymentMode('Bank Transfer');
        setReference('TRN-EDIT-12345');
        setShowInvoiceSelect(false); // Don't show selection list initially in edit mode

        setShowAddModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await paymentReceiptService.deletePayment(deleteId);
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchData();
        } catch (err) {
            console.error('Error deleting payment:', err);
            setError(err.response?.data?.message || 'Failed to delete payment');
        }
    };

    return (
        <div className="payment-page">
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Received Payments</h1>
                    <p className="page-subtitle">Record and track customer payments</p>
                </div>
                <div className="header-actions">
                    <button className="btn-add" onClick={handleOpenModal}>
                        <Plus size={18} className="mr-2" /> Record Payment
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
                        <input type="text" placeholder="Search payments..." className="search-input" />
                    </div>
                </div>

                <div className="table-container">
                    <table className="payment-table">
                        <thead>
                            <tr>
                                <th>PAYMENT ID</th>
                                <th>INVOICE</th>
                                <th>CUSTOMER</th>
                                <th>DATE</th>
                                <th>MODE</th>
                                <th>AMOUNT</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4">No payments found</td></tr>
                            ) : payments.map(payment => (
                                <tr key={payment.id}>
                                    <td className="font-bold text-blue-600">{payment.receiptNumber}</td>
                                    <td><span className="source-link">{payment.invoice?.invoiceNumber || 'N/A'}</span></td>
                                    <td>{payment.customer?.name || 'N/A'}</td>
                                    <td>{formatDate(payment.paymentDate)}</td>
                                    <td>{formatPaymentMethod(payment.paymentMethod)}</td>
                                    <td className="font-bold text-green-600">${payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-action-header delete" onClick={() => handleDeleteClick(payment.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Payment Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content payment-modal">
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">{isEditMode ? 'Edit Payment' : 'Record Payment'}</h2>
                                <p className="modal-subtitle">{isEditMode ? 'Update payment details' : 'Log payment against an invoice'}</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">

                            {/* Invoice Selection List */}
                            {showInvoiceSelect && !selectedInvoice && (
                                <div className="invoice-link-container">
                                    <h3 className="text-sm font-bold mb-3 text-gray-700">Select Unpaid Invoice</h3>
                                    {unpaidInvoices.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No unpaid invoices found</p>
                                    ) : (
                                        <div className="invoice-grid">
                                            {unpaidInvoices.map(inv => (
                                                <div key={inv.id} className="invoice-link-card" onClick={() => handleSelectInvoice(inv)}>
                                                    <div className="i-card-header">
                                                        <span className="i-id">{inv.invoiceNumber}</span>
                                                        <span className="i-date">{formatDate(inv.invoiceDate)}</span>
                                                    </div>
                                                    <div className="i-card-body">
                                                        <span className="i-customer">{inv.customer?.name || 'N/A'}</span>
                                                        <div className="i-amount">
                                                            <span>Due: </span>
                                                            <span className="font-bold text-red-500">${inv.dueAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="form-container">
                                {/* Company Info - Read Only */}
                                <div className="company-info-readonly mb-6">
                                    <div className="company-brand">
                                        <div className="logo-placeholder">ZB</div>
                                        <div className="brand-details">
                                            <h4>Zirak Books</h4>
                                            <p>Receiver Details</p>
                                        </div>
                                    </div>
                                    <div className="company-meta">
                                        <p><strong>Method:</strong> Bank / Cash / Cheque</p>
                                    </div>
                                </div>

                                {selectedInvoice && (
                                    <div className="linked-indicator mb-6">
                                        <Wallet size={16} /> Receiving Payment for <strong>{selectedInvoice.invoiceNumber}</strong>
                                        <button className="change-link-btn" onClick={() => { setSelectedInvoice(null); setShowInvoiceSelect(true); }}>Change Invoice</button>
                                    </div>
                                )}

                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Customer Name</label>
                                        <input
                                            type="text"
                                            className="form-input bg-gray-50"
                                            value={customer}
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Payment Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={paymentDate}
                                            onChange={(e) => setPaymentDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Payment Mode</label>
                                        <select
                                            className="form-input"
                                            value={paymentMode}
                                            onChange={(e) => setPaymentMode(e.target.value)}
                                        >
                                            <option value="BANK_TRANSFER">Bank Transfer</option>
                                            <option value="CASH">Cash</option>
                                            <option value="CHEQUE">Cheque</option>
                                            <option value="CREDIT_CARD">Credit Card</option>
                                            <option value="DEBIT_CARD">Debit Card</option>
                                            <option value="UPI">UPI</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Reference ID / Check No.</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. TRN-12345678"
                                            value={reference}
                                            onChange={(e) => setReference(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="amount-section mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div className="form-group mb-0">
                                        <label className="form-label text-green-800 font-bold">Amount Received ($)</label>
                                        <div className="input-with-symbol text-lg">
                                            <input
                                                type="number"
                                                className="form-input text-2xl font-bold text-green-700 h-12"
                                                value={amountReceived}
                                                onChange={(e) => setAmountReceived(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mt-6">
                                    <label className="form-label">Notes</label>
                                    <textarea className="form-textarea h-20" placeholder="Internal notes..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="footer-left">
                                <button className="btn-secondary">
                                    <Printer size={16} /> Print Receipt
                                </button>
                            </div>
                            <div className="footer-right">
                                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn-submit" style={{ backgroundColor: '#8ce043' }} disabled={!selectedInvoice} onClick={handleSavePayment}>
                                    {isEditMode ? 'Update Payment' : 'Save Payment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-modal-content">
                        <div className="delete-modal-header">
                            <h2 className="text-lg font-bold text-red-600">Delete Payment?</h2>
                            <button className="close-btn-simple" onClick={() => setShowDeleteModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="delete-modal-body">
                            <p className="text-gray-600">
                                Are you sure you want to delete this Payment Record? This will revert the Invoice balance.
                            </p>
                        </div>
                        <div className="delete-modal-footer">
                            <button className="btn-plain" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
