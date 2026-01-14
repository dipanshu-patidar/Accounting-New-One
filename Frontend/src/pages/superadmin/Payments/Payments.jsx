import React, { useState, useEffect } from 'react';
import {
    CreditCard, Search, Eye, Trash2, X,
    CheckCircle2, AlertCircle, Building2,
    Calendar, Filter, Receipt, Wallet
} from 'lucide-react';
import toast from 'react-hot-toast';
import paymentService from '../../../services/paymentService';
import './Payments.css';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [formData, setFormData] = useState({
        transactionId: '',
        customer: '',
        paymentMethod: 'Credit Card',
        amount: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await paymentService.getPayments();
            setPayments(data);
        } catch (error) {
            toast.error('Failed to fetch payments');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedPayment && !showViewModal) {
                await paymentService.updatePayment(selectedPayment.id, formData);
                toast.success('Payment updated successfully');
            } else {
                await paymentService.createPayment(formData);
                toast.success('Payment recorded successfully');
            }
            fetchPayments();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async () => {
        try {
            await paymentService.deletePayment(paymentToDelete.id);
            toast.success('Payment deleted successfully');
            fetchPayments();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete payment');
        }
    };

    const openModal = (payment = null) => {
        if (payment) {
            setSelectedPayment(payment);
            setFormData({
                transactionId: payment.transactionId,
                customer: payment.customer,
                paymentMethod: payment.paymentMethod,
                amount: payment.amount,
                status: payment.status,
                date: payment.date ? payment.date.split('T')[0] : ''
            });
        } else {
            setSelectedPayment(null);
            setFormData({
                transactionId: `TRX${Math.floor(100000000 + Math.random() * 900000000)}`,
                customer: '',
                paymentMethod: 'Credit Card',
                amount: '',
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setShowModal(true);
    };

    const openViewModal = (payment) => {
        setSelectedPayment(payment);
        setShowViewModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setSelectedPayment(null);
    };

    const getStatusBadgeClass = (status) => {
        const s = status?.toString().toLowerCase();
        if (s === 'success' || s === 'completed' || s === 'paid') return 'badge-success';
        if (s === 'failed' || s === 'cancelled' || s === 'rejected') return 'badge-danger';
        if (s === 'pending') return 'badge-warning';
        return 'badge-secondary';
    };

    const getStatusLabel = (status) => {
        if (!status) return 'Pending';
        const s = status.toString().toLowerCase();
        if (s === 'success' || s === 'paid') return 'Success';
        if (s === 'completed') return 'Completed';
        if (s === 'failed') return 'Failed';
        if (s === 'pending') return 'Pending';
        return status;
    };

    const filteredPayments = payments.filter(pay => {
        const matchesSearch = pay.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pay.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || pay.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="payments-page">
            <div className="page-header">
                <div className="page-title">
                    <Wallet size={24} className="text-blue-500" />
                    <span>Transaction Payments</span>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by ID or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group flex items-center gap-2">
                    
                    <select
                        className="form-control"
                        style={{ width: '200px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-10">Loading transactions...</td></tr>
                        ) : filteredPayments.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-10">No transactions found.</td></tr>
                        ) : (
                            filteredPayments.map(payment => (
                                <tr key={payment.id}>
                                    <td className="font-mono font-bold text-blue-600">{payment.transactionId}</td>
                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="company-icon-sm">
                                                <Building2 size={16} />
                                            </div>
                                            <span className="font-semibold">{payment.customer}</span>
                                        </div>
                                    </td>
                                    <td>{payment.paymentMethod}</td>
                                    <td className="font-bold">${payment.amount.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(payment.status)}`}>
                                            {getStatusLabel(payment.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-btns-wrapper">
                                            <button
                                                className="btn-action-sm btn-edit-sm"
                                                onClick={() => openViewModal(payment)}
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="btn-action-sm btn-delete-sm"
                                                onClick={() => { setPaymentToDelete(payment); setShowDeleteModal(true); }}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h2>{selectedPayment ? 'Update Payment Record' : 'Record New Payment'}</h2>
                            <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="space-y-4">
                                    <div className="form-grid">
                                        <div className="form-group mb-4">
                                            <label className="required block mb-1 font-semibold text-slate-700">Transaction ID</label>
                                            <div className="input-with-icon">
                                                <Receipt size={16} className="input-icon" />
                                                <input
                                                    type="text"
                                                    name="transactionId"
                                                    className="form-control"
                                                    value={formData.transactionId}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="required block mb-1 font-semibold text-slate-700">Date</label>
                                            <div className="input-with-icon">
                                                <Calendar size={16} className="input-icon" />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    className="form-control"
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="required block mb-1 font-semibold text-slate-700">Customer / Company</label>
                                        <div className="input-with-icon">
                                            <Building2 size={16} className="input-icon" />
                                            <input
                                                type="text"
                                                name="customer"
                                                className="form-control"
                                                placeholder="Enter Customer Name"
                                                value={formData.customer}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-group mb-4">
                                            <label className="required block mb-1 font-semibold text-slate-700">Amount ($)</label>
                                            <div className="input-with-icon">
                                                <Wallet size={16} className="input-icon" />
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    className="form-control"
                                                    placeholder="0.00"
                                                    value={formData.amount}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="required block mb-1 font-semibold text-slate-700">Payment Method</label>
                                            <select
                                                name="paymentMethod"
                                                className="form-control w-full"
                                                value={formData.paymentMethod}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="Credit Card">Credit Card</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                                <option value="PayPal">PayPal</option>
                                                <option value="Cash">Cash</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="block mb-1 font-semibold text-slate-700">Payment Status</label>
                                        <select
                                            name="status"
                                            className="form-control w-full"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Success">Success</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-save">
                                    {selectedPayment ? 'Update Payment' : 'Save Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedPayment && (
                <div className="modal-overlay">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h2>Transaction Receipt</h2>
                            <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="receipt-view">
                                <div className="receipt-top">
                                    <div className={`receipt-icon-circle ${selectedPayment.status?.toLowerCase() === 'success' ? 'success' : 'pending'}`}>
                                        {selectedPayment.status?.toLowerCase() === 'success' ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                                    </div>
                                    <h3 className="receipt-amount">${selectedPayment.amount?.toLocaleString()}</h3>
                                    <p className={`receipt-status-text ${selectedPayment.status?.toLowerCase() === 'success' ? 'text-success' : 'text-warning'}`}>
                                        Transaction {getStatusLabel(selectedPayment.status)}
                                    </p>
                                </div>

                                <div className="receipt-items">
                                    <div className="receipt-row">
                                        <span className="receipt-label">Transaction ID</span>
                                        <span className="receipt-value font-mono">{selectedPayment.transactionId}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">Date</span>
                                        <span className="receipt-value">{new Date(selectedPayment.date).toLocaleString()}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">Customer</span>
                                        <span className="receipt-value">{selectedPayment.customer}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">Payment Method</span>
                                        <span className="receipt-value">{selectedPayment.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-t-0 bg-white">
                            <button className="add-btn w-full justify-center" onClick={() => { setShowViewModal(false); openModal(selectedPayment); }}>
                                Edit Transaction Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content modal-sm">
                        <div className="delete-modal-body">
                            <div className="delete-icon-wrapper">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="delete-modal-title">Delete Payment?</h3>
                            <p className="delete-modal-text">
                                Are you sure you want to delete this transaction record?
                                <br />This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3 mt-4">
                                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn-delete" onClick={handleDelete}>Delete Anyway</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
