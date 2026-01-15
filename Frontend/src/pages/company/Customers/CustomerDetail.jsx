import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Pencil, Trash2, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import customerService from '../../../services/customerService';
import './CustomerDetail.css';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const data = await customerService.getCustomer(id);
            setCustomer(data);
        } catch (error) {
            console.error('Error fetching customer:', error);
            toast.error('Failed to fetch customer details');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="CustomerDetail-customer-detail-page">
                <div className="CustomerDetail-loading">Loading customer details...</div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="CustomerDetail-customer-detail-page">
                <div className="CustomerDetail-not-found">Customer not found</div>
            </div>
        );
    }

    return (
        <div className="CustomerDetail-customer-detail-page">
            <div className="CustomerDetail-detail-header">
                <div className="CustomerDetail-header-left">
                    <h1 className="CustomerDetail-page-title">Customer Details</h1>
                </div>
                <div className="CustomerDetail-header-actions">
                    <button className="CustomerDetail-btn-action CustomerDetail-bg-green" onClick={() => navigate('/company/sales/invoice')}>
                        Create Invoice
                    </button>
                    <button className="CustomerDetail-btn-back" onClick={() => navigate('/company/accounts/customers')}>
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>
            </div>

            <div className="CustomerDetail-info-cards-grid">
                <div className="CustomerDetail-info-card">
                    <h3 className="CustomerDetail-card-title">Customer Info</h3>
                    <div className="CustomerDetail-card-content">
                        <p className="CustomerDetail-primary-text">{customer.name}</p>
                        <p className="CustomerDetail-secondary-text">{customer.email || 'No email'}</p>
                        <p className="CustomerDetail-secondary-text">{customer.phone || 'No phone'}</p>
                        <p className="CustomerDetail-secondary-text">GST: {customer.gstNumber || 'Not provided'}</p>
                    </div>
                </div>
                <div className="CustomerDetail-info-card">
                    <h3 className="CustomerDetail-card-title">Address</h3>
                    <div className="CustomerDetail-card-content">
                        <p className="CustomerDetail-secondary-text CustomerDetail-address-text">
                            {customer.address || 'No address provided'}
                        </p>
                    </div>
                </div>
                <div className="CustomerDetail-info-card">
                    <h3 className="CustomerDetail-card-title">Credit Terms</h3>
                    <div className="CustomerDetail-card-content">
                        <p className="CustomerDetail-secondary-text">Credit Limit: {formatCurrency(customer.creditLimit)}</p>
                        <p className="CustomerDetail-secondary-text">Credit Days: {customer.creditDays || 0} days</p>
                    </div>
                </div>
            </div>

            <div className="CustomerDetail-company-info-card">
                <h3 className="CustomerDetail-card-title">Account Summary</h3>
                <div className="CustomerDetail-info-row">
                    <div className="CustomerDetail-info-item">
                        <span className="CustomerDetail-item-label">Customer ID</span>
                        <span className="CustomerDetail-item-value CustomerDetail-text-bold">#{customer.id}</span>
                    </div>
                    <div className="CustomerDetail-info-item">
                        <span className="CustomerDetail-item-label">Date Created</span>
                        <span className="CustomerDetail-item-value CustomerDetail-text-bold">{formatDate(customer.createdAt)}</span>
                    </div>
                    <div className="CustomerDetail-info-item">
                        <span className="CustomerDetail-item-label">Opening Balance</span>
                        <span className="CustomerDetail-item-value CustomerDetail-text-bold">{formatCurrency(customer.openingBalance)}</span>
                    </div>
                    <div className="CustomerDetail-info-item">
                        <span className="CustomerDetail-item-label">Current Balance</span>
                        <span className={`CustomerDetail-item-value CustomerDetail-text-bold ${customer.currentBalance < 0 ? 'CustomerDetail-text-red' : 'CustomerDetail-text-green'}`}>
                            {formatCurrency(customer.currentBalance)}
                        </span>
                    </div>
                </div>
                <div className="CustomerDetail-info-row">
                    <div className="CustomerDetail-info-item">
                        <span className="CustomerDetail-item-label">Status</span>
                        <span className={`CustomerDetail-status-badge ${customer.isActive ? 'CustomerDetail-status-active' : 'CustomerDetail-status-inactive'}`}>
                            {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="CustomerDetail-info-item">
                        <span className="CustomerDetail-item-label">Linked Ledger Account</span>
                        <span className="CustomerDetail-item-value CustomerDetail-text-bold">
                            {customer.ledgerAccountId ? `Account #${customer.ledgerAccountId}` : 'Not linked'}
                        </span>
                    </div>
                </div>
            </div>

            <section className="CustomerDetail-detail-section">
                <div className="CustomerDetail-section-header">
                    <h2 className="CustomerDetail-section-title">Ledger Entries</h2>
                    <button className="CustomerDetail-btn-refresh" onClick={fetchCustomer}>
                        <RefreshCw size={16} />
                    </button>
                </div>
                <div className="CustomerDetail-table-responsive">
                    <table className="CustomerDetail-detail-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>VOUCHER NO</th>
                                <th>TYPE</th>
                                <th>NARRATION</th>
                                <th>DEBIT</th>
                                <th>CREDIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!customer.ledgerEntries || customer.ledgerEntries.length === 0) ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No ledger entries found</td>
                                </tr>
                            ) : (
                                customer.ledgerEntries.map((entry, index) => (
                                    <tr key={entry.id || index}>
                                        <td>{formatDate(entry.date)}</td>
                                        <td><span className="CustomerDetail-id-badge">{entry.voucherNumber || '-'}</span></td>
                                        <td>{entry.referenceType || 'Journal'}</td>
                                        <td>{entry.narration || '-'}</td>
                                        <td className="CustomerDetail-text-red">
                                            {entry.entryType === 'DEBIT' ? formatCurrency(entry.amount) : '-'}
                                        </td>
                                        <td className="CustomerDetail-text-green">
                                            {entry.entryType === 'CREDIT' ? formatCurrency(entry.amount) : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CustomerDetail;
