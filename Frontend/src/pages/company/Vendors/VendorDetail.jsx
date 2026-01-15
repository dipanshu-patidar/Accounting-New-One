import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Pencil, Trash2, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import vendorService from '../../../services/vendorService';
import './VendorDetail.css';

const VendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendor();
    }, [id]);

    const fetchVendor = async () => {
        try {
            setLoading(true);
            const data = await vendorService.getVendor(id);
            setVendor(data);
        } catch (error) {
            console.error('Error fetching vendor:', error);
            toast.error('Failed to fetch vendor details');
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
            <div className="VendorDetail-vendor-detail-page">
                <div className="VendorDetail-loading">Loading vendor details...</div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="VendorDetail-vendor-detail-page">
                <div className="VendorDetail-not-found">Vendor not found</div>
            </div>
        );
    }

    return (
        <div className="VendorDetail-vendor-detail-page">
            <div className="VendorDetail-detail-header">
                <div className="VendorDetail-header-left">
                    <h1 className="VendorDetail-page-title">Vendor Details</h1>
                </div>
                <div className="VendorDetail-header-actions">
                    <button className="VendorDetail-btn-action VendorDetail-bg-green" onClick={() => navigate('/company/purchases/bill')}>
                        Create Bill
                    </button>
                    <button className="VendorDetail-btn-back" onClick={() => navigate('/company/accounts/vendors')}>
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>
            </div>

            <div className="VendorDetail-info-cards-grid">
                <div className="VendorDetail-info-card">
                    <h3 className="VendorDetail-card-title">Vendor Info</h3>
                    <div className="VendorDetail-card-content">
                        <p className="VendorDetail-primary-text">{vendor.name}</p>
                        <p className="VendorDetail-secondary-text">{vendor.email || 'No email'}</p>
                        <p className="VendorDetail-secondary-text">{vendor.phone || 'No phone'}</p>
                        <p className="VendorDetail-secondary-text">GST: {vendor.gstNumber || 'Not provided'}</p>
                    </div>
                </div>
                <div className="VendorDetail-info-card">
                    <h3 className="VendorDetail-card-title">Address</h3>
                    <div className="VendorDetail-card-content">
                        <p className="VendorDetail-secondary-text VendorDetail-address-text">
                            {vendor.address || 'No address provided'}
                        </p>
                    </div>
                </div>
                <div className="VendorDetail-info-card">
                    <h3 className="VendorDetail-card-title">Credit Terms</h3>
                    <div className="VendorDetail-card-content">
                        <p className="VendorDetail-secondary-text">Credit Limit: {formatCurrency(vendor.creditLimit)}</p>
                        <p className="VendorDetail-secondary-text">Credit Days: {vendor.creditDays || 0} days</p>
                    </div>
                </div>
            </div>

            <div className="VendorDetail-company-info-card">
                <h3 className="VendorDetail-card-title">Account Summary</h3>
                <div className="VendorDetail-info-row">
                    <div className="VendorDetail-info-item">
                        <span className="VendorDetail-item-label">Vendor ID</span>
                        <span className="VendorDetail-item-value VendorDetail-text-bold">#{vendor.id}</span>
                    </div>
                    <div className="VendorDetail-info-item">
                        <span className="VendorDetail-item-label">Date Created</span>
                        <span className="VendorDetail-item-value VendorDetail-text-bold">{formatDate(vendor.createdAt)}</span>
                    </div>
                    <div className="VendorDetail-info-item">
                        <span className="VendorDetail-item-label">Opening Balance</span>
                        <span className="VendorDetail-item-value VendorDetail-text-bold">{formatCurrency(vendor.openingBalance)}</span>
                    </div>
                    <div className="VendorDetail-info-item">
                        <span className="VendorDetail-item-label">Current Balance</span>
                        <span className={`VendorDetail-item-value VendorDetail-text-bold ${vendor.currentBalance < 0 ? 'VendorDetail-text-red' : 'VendorDetail-text-green'}`}>
                            {formatCurrency(vendor.currentBalance)}
                        </span>
                    </div>
                </div>
                <div className="VendorDetail-info-row">
                    <div className="VendorDetail-info-item">
                        <span className="VendorDetail-item-label">Status</span>
                        <span className={`VendorDetail-status-badge ${vendor.isActive ? 'VendorDetail-status-active' : 'VendorDetail-status-inactive'}`}>
                            {vendor.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="VendorDetail-info-item">
                        <span className="VendorDetail-item-label">Linked Ledger Account</span>
                        <span className="VendorDetail-item-value VendorDetail-text-bold">
                            {vendor.ledgerAccountId ? `Account #${vendor.ledgerAccountId}` : 'Not linked'}
                        </span>
                    </div>
                </div>
            </div>

            <section className="VendorDetail-detail-section">
                <div className="VendorDetail-section-header">
                    <h2 className="VendorDetail-section-title">Ledger Entries</h2>
                    <button className="VendorDetail-btn-refresh" onClick={fetchVendor}>
                        <RefreshCw size={16} />
                    </button>
                </div>
                <div className="VendorDetail-table-responsive">
                    <table className="VendorDetail-detail-table">
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
                            {(!vendor.ledgerEntries || vendor.ledgerEntries.length === 0) ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No ledger entries found</td>
                                </tr>
                            ) : (
                                vendor.ledgerEntries.map((entry, index) => (
                                    <tr key={entry.id || index}>
                                        <td>{formatDate(entry.date)}</td>
                                        <td><span className="VendorDetail-id-badge">{entry.voucherNumber || '-'}</span></td>
                                        <td>{entry.referenceType || 'Journal'}</td>
                                        <td>{entry.narration || '-'}</td>
                                        <td className="VendorDetail-text-red">
                                            {entry.entryType === 'DEBIT' ? formatCurrency(entry.amount) : '-'}
                                        </td>
                                        <td className="VendorDetail-text-green">
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

export default VendorDetail;
