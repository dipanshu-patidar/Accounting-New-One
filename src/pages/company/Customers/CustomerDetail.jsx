import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, Download } from 'lucide-react';
import './CustomerDetail.css';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data for the demonstration
    const customer = {
        name: 'Keir',
        email: 'IsidroTJohnson@armyspy.com',
        phone: '+8596741234',
        id: '#CUST00001',
        creationDate: 'Jul 8, 2020',
        balance: '$-39,202.45',
        overdue: '$40,352.00',
        totalInvoices: '$42,472.00',
        invoiceCount: 3,
        averageSales: '$14,157.33',
        paidAmount: '$2,110.00',
        billing: {
            name: 'Keir',
            address: '198 , Bombay Talkies Compd, Himanshurai Road, Malad (west) Mumbai, Maharashtra, 400064 India',
            phone: '+02228896140'
        },
        shipping: {
            name: 'Keir',
            address: '198 , Bombay Talkies Compd, Himanshurai Road, Malad (west) Mumbai, Maharashtra, 400064 India',
            phone: '+02228896140'
        }
    };

    const invoices = [
        { id: '#INVO00001', issueDate: 'Apr 8, 2025', dueDate: 'Jun 12, 2025', amount: '$56.50', status: 'Partially Paid' },
        { id: '#INVO00003', issueDate: 'Apr 8, 2025', dueDate: 'Apr 30, 2025', amount: '$40,200.00', status: 'Partially Paid' },
        { id: '#INVO00004', issueDate: 'Apr 8, 2025', dueDate: 'May 14, 2025', amount: '$95.50', status: 'Sent' },
    ];

    return (
        <div className="customer-detail-page">
            <div className="detail-header">
                <div className="header-left">
                    <h1 className="page-title">Manage Customer Detail</h1>
                </div>
                <div className="header-actions">
                    <button className="btn-action bg-green" onClick={() => navigate('/company/sales/invoice')}>Create Invoice</button>
                    <button className="btn-back" onClick={() => navigate('/company/accounts/customers')}>Back</button>
                </div>
            </div>

            <div className="info-cards-grid">
                <div className="info-card">
                    <h3 className="card-title">Customer Info</h3>
                    <div className="card-content">
                        <p className="primary-text">{customer.name}</p>
                        <p className="secondary-text">{customer.email}</p>
                        <p className="secondary-text">{customer.phone}</p>
                        <p className="secondary-text">560</p>
                    </div>
                </div>
                <div className="info-card">
                    <h3 className="card-title">Billing Info</h3>
                    <div className="card-content">
                        <p className="primary-text">{customer.billing.name}</p>
                        <p className="secondary-text address-text">{customer.billing.address}</p>
                        <p className="secondary-text">{customer.billing.phone}</p>
                    </div>
                </div>
                <div className="info-card">
                    <h3 className="card-title">Shipping Info</h3>
                    <div className="card-content">
                        <p className="primary-text">{customer.shipping.name}</p>
                        <p className="secondary-text address-text">{customer.shipping.address}</p>
                        <p className="secondary-text">{customer.shipping.phone}</p>
                    </div>
                </div>
            </div>

            <div className="company-info-card">
                <h3 className="card-title">Company Info</h3>
                <div className="info-row">
                    <div className="info-item">
                        <span className="item-label">Customer Id</span>
                        <span className="item-value text-bold">{customer.id}</span>
                    </div>
                    <div className="info-item">
                        <span className="item-label">Date of Creation</span>
                        <span className="item-value text-bold">{customer.creationDate}</span>
                    </div>
                    <div className="info-item">
                        <span className="item-label">Balance</span>
                        <span className="item-value text-bold">{customer.balance}</span>
                    </div>
                    <div className="info-item">
                        <span className="item-label">Overdue</span>
                        <span className="item-value text-bold text-red">{customer.overdue}</span>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-item">
                        <span className="item-label">Total Sum of Invoices</span>
                        <span className="item-value text-bold">{customer.totalInvoices}</span>
                    </div>
                    <div className="info-item">
                        <span className="item-label">Quantity of Invoice</span>
                        <span className="item-value text-bold">{customer.invoiceCount}</span>
                    </div>
                    <div className="info-item">
                        <span className="item-label">Average Sales</span>
                        <span className="item-value text-bold">{customer.averageSales}</span>
                    </div>
                    <div className="info-item">
                        <span className="item-label">Paid Amount</span>
                        <span className="item-value text-bold">{customer.paidAmount}</span>
                    </div>
                </div>
            </div>

            <section className="detail-section">
                <h2 className="section-title">Invoice</h2>
                <div className="table-responsive">
                    <table className="detail-table">
                        <thead>
                            <tr>
                                <th>INVOICE</th>
                                <th>ISSUE DATE</th>
                                <th>DUE DATE</th>
                                <th>AMOUNT DUE</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id}>
                                    <td><span className="id-badge">{inv.id}</span></td>
                                    <td>{inv.issueDate}</td>
                                    <td><span className="text-red">{inv.dueDate}</span></td>
                                    <td>{inv.amountDue}</td>
                                    <td><span className={`status-badge ${inv.status === 'Sent' ? 'orange' : 'cyan'}`}>{inv.status}</span></td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-icon-btn bg-gray"><Download size={14} /></button>
                                            <button className="table-icon-btn bg-orange"><Eye size={14} /></button>
                                            <button className="table-icon-btn bg-cyan"><Pencil size={14} /></button>
                                            <button className="table-icon-btn bg-pink"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CustomerDetail;
