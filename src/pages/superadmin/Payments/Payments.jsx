import React, { useState } from 'react';
import { FileText, TrendingUp, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import './Payments.css';

const Payments = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [paymentData, setPaymentData] = useState([
        { id: 285, date: 'Dec 25, 2025', customer: 'Jay', method: 'Sales Order', amount: '0.00', ybStatus: 'Success' },
        { id: 75, date: 'Dec 25, 2025', customer: 'Jay', method: 'Purchase Order', amount: '100.00', ybStatus: 'Pending' },
        { id: 251, date: 'Dec 23, 2025', customer: 'Unknown', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
        { id: 256, date: 'Dec 23, 2025', customer: 'Unknown', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
        { id: 257, date: 'Dec 23, 2025', customer: 'Unknown', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
        { id: 258, date: 'Dec 23, 2025', customer: 'Unknown', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
        { id: 259, date: 'Dec 23, 2025', customer: 'Unknown', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
        { id: 260, date: 'Dec 23, 2025', customer: 'Customer A', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
        { id: 261, date: 'Dec 23, 2025', customer: 'Customer A', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
        { id: 262, date: 'Dec 23, 2025', customer: 'Customer A', method: 'Sales Order', amount: '0.00', ybStatus: 'Pending' },
    ]);

    const handleViewClick = (payment) => {
        setSelectedPayment(payment);
        setShowViewModal(true);
    };

    const handleDeleteClick = (payment) => {
        setSelectedPayment(payment);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setPaymentData(paymentData.filter(p => p.id !== selectedPayment.id));
        setShowDeleteModal(false);
        setSelectedPayment(null);
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setShowDeleteModal(false);
        setSelectedPayment(null);
    };

    return (
        <div className="payments-page">
            {/* Header */}
            <div className="page-header">
                <div className="page-title">
                    <h1>Payments</h1>
                    <p className="sub-title">Manage all your payment transactions</p>
                </div>
                <button className="btn-export">
                    <FileText size={16} />
                    Export Excel
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stats-card">
                    <div className="stats-header">
                        <div className="stats-icon revenue">
                            <TrendingUp size={18} />
                        </div>
                        <span>Total Revenue</span>
                    </div>
                    <div className="stats-value">₹90,000.00</div>
                    <div className="stats-subtext positive">From 8 successful payments</div>
                </div>

                <div className="stats-card">
                    <div className="stats-header">
                        <div className="stats-icon success">
                            <CheckCircle size={18} />
                        </div>
                        <span>Success Rate</span>
                    </div>
                    <div className="stats-value">8.6%</div>
                    <div className="stats-subtext positive">8 of 93 succeeded</div>
                </div>

                <div className="stats-card">
                    <div className="stats-header">
                        <div className="stats-icon failed">
                            <AlertCircle size={18} />
                        </div>
                        <span>Failed Transactions</span>
                    </div>
                    <div className="stats-value">0</div>
                    <div className="stats-subtext negative">↓ 0.0% of total</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Payments
                </button>
                <button
                    className={`tab-btn ${activeTab === 'failed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('failed')}
                >
                    Failed Transactions
                </button>
                <button
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Payment Settings
                </button>
            </div>

            {/* Content Area */}
            <div className="search-bar-wide">
                <input type="text" placeholder="Search by transaction ID or customer name" />
            </div>

            <div className="content-card">
                <div className="table-header-section">
                    <h3 className="table-title">All Payments</h3>
                    <p className="table-subtitle">A list of all payment transactions.</p>
                </div>

                <div className="table-responsive">
                    <table className="payments-table">
                        <thead>
                            <tr>
                                <th className="checkbox-cell">
                                    <input type="checkbox" />
                                </th>
                                <th>TRANSACTION ID</th>
                                <th>DATE</th>
                                <th>CUSTOMER</th>
                                <th>PAYMENT METHOD</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="checkbox-cell">
                                        <input type="checkbox" />
                                    </td>
                                    <td>{payment.id}</td>
                                    <td>{payment.date}</td>
                                    <td><strong>{payment.customer}</strong></td>
                                    <td>{payment.method}</td>
                                    <td>₹{payment.amount}</td>
                                    <td>
                                        <span className={`status-pill ${payment.ybStatus === 'Success' ? 'status-success' : 'status-pending'}`}>
                                            {payment.ybStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-icon view"
                                                title="View Details"
                                                onClick={() => handleViewClick(payment)}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="action-icon delete"
                                                title="Delete"
                                                onClick={() => handleDeleteClick(payment)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Payment Modal */}
            {showViewModal && selectedPayment && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Transaction Details</h3>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Transaction ID</span>
                                <span className="detail-value text-primary">#{selectedPayment.id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Customer Name</span>
                                <span className="detail-value">{selectedPayment.customer}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">{selectedPayment.date}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Amount</span>
                                <span className="detail-value">₹{selectedPayment.amount}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Payment Method</span>
                                <span className="detail-value">{selectedPayment.method}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status</span>
                                <span className={`status-pill ${selectedPayment.ybStatus === 'Success' ? 'status-success' : 'status-pending'}`}>
                                    {selectedPayment.ybStatus}
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPayment && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete transaction <strong>#{selectedPayment.id}</strong>?</p>
                            <p className="text-sm text-muted mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                            <button className="delete-confirm-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
