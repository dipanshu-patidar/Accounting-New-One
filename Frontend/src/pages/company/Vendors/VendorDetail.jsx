import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Pencil, Trash2, FileText, Printer, Search } from 'lucide-react';
import './VendorDetail.css';

const VendorDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data based on the provided image
    const vendor = {
        name: 'Anthony B Renfroe',
        email: 'anthony@dayrep.com',
        phone: '+85967412345',
        vendorId: '#VEND00001',
        creationDate: 'Jul 8, 2020',
        balance: '8,454.08',
        overdue: '7,744.09',
        totalBills: '8,294.09',
        billQuantity: 3,
        averageSales: '2,764.70',
        paidAmount: '550.00',
        billing: {
            name: 'Anthony B Renfroe',
            phone: '+15733533404',
            address: 'ds 65109 Jefferson City, Missouri, United States'
        },
        shipping: {
            name: 'Anthony B Renfroe',
            phone: '+15733533404',
            address: 'ds Jefferson City, Missouri, 65109 United States'
        }
    };

    const bills = [
        { id: '#BILL00025', date: 'Apr 30, 2025', dueDate: 'Jul 31, 2025', amountDue: '$7,694.19', status: 'Partially Paid' },
        { id: '#BILL00012', date: 'Apr 8, 2025', dueDate: 'May 10, 2025', amountDue: '$16.60', status: 'Partially Paid' },
        { id: '#BILL00023', date: 'Apr 8, 2025', dueDate: 'May 10, 2025', amountDue: '$33.30', status: 'Sent' }
    ];

    return (
        <div className="vendor-detail-page">
            <div className="detail-header">
                <div className="header-left">
                    <h1 className="page-title">Manage Vendor-Detail</h1>
                </div>
                <div className="header-actions">
                    <button className="btn-action bg-green" onClick={() => navigate('/company/purchases/bill')}>Create Bill</button>
                    <button className="btn-back" onClick={() => navigate('/company/accounts/vendors')}>Back</button>
                </div>
            </div>

            <div className="info-cards-grid">
                <div className="info-card">
                    <h3 className="card-title">Vendor Info</h3>
                    <div className="card-body">
                        <p className="info-text">{vendor.name}</p>
                        <p className="info-text">{vendor.email}</p>
                        <p className="info-text">{vendor.phone}</p>
                        <p className="info-subtext">560</p>
                    </div>
                </div>
                <div className="info-card">
                    <h3 className="card-title">Billing Info</h3>
                    <div className="card-body">
                        <p className="info-text">{vendor.billing.name}</p>
                        <p className="info-text">{vendor.billing.phone}</p>
                        <p className="info-text">{vendor.billing.address}</p>
                    </div>
                </div>
                <div className="info-card">
                    <h3 className="card-title">Shipping Info</h3>
                    <div className="card-body">
                        <p className="info-text">{vendor.shipping.name}</p>
                        <p className="info-text">ds</p>
                        <p className="info-text">{vendor.shipping.address}</p>
                        <p className="info-text">{vendor.shipping.phone}</p>
                    </div>
                </div>
            </div>

            <div className="company-info-card">
                <h3 className="card-title">Company Info</h3>
                <div className="metrics-grid">
                    <div className="metric-item">
                        <label>Vendor Id</label>
                        <p>{vendor.vendorId}</p>
                    </div>
                    <div className="metric-item">
                        <label>Date of Creation</label>
                        <p>{vendor.creationDate}</p>
                    </div>
                    <div className="metric-item">
                        <label>Balance</label>
                        <p className="text-bold">${vendor.balance}</p>
                    </div>
                    <div className="metric-item">
                        <label>Overdue</label>
                        <p className="text-bold text-red">${vendor.overdue}</p>
                    </div>
                    <div className="metric-item">
                        <label>Total Sum of Bills</label>
                        <p className="text-bold">${vendor.totalBills}</p>
                    </div>
                    <div className="metric-item">
                        <label>Quantity of Bills</label>
                        <p>{vendor.billQuantity}</p>
                    </div>
                    <div className="metric-item">
                        <label>Average Sales</label>
                        <p className="text-bold">${vendor.averageSales}</p>
                    </div>
                    <div className="metric-item">
                        <label>Paid Amount</label>
                        <p className="text-bold text-green">${vendor.paidAmount}</p>
                    </div>
                </div>
            </div>

            <section className="detail-section">
                <h2 className="section-title">Bills</h2>

                <div className="bills-card">
                    <div className="controls-row">
                        <div className="entries-control">
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="entries-select"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="entries-text">entries per page</span>
                        </div>
                        <div className="search-control">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="detail-table">
                            <thead>
                                <tr>
                                    <th>BILL</th>
                                    <th>BILL DATE</th>
                                    <th>DUE DATE</th>
                                    <th>AMOUNT DUE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map(bill => (
                                    <tr key={bill.id}>
                                        <td>
                                            <div className="voucher-badge-small">
                                                {bill.id}
                                            </div>
                                        </td>
                                        <td>{bill.date}</td>
                                        <td className="text-red">{bill.dueDate}</td>
                                        <td>{bill.amountDue}</td>
                                        <td>
                                            <span className={`status-badge-modern ${bill.status.toLowerCase().replace(' ', '-')}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="table-icon-btn bg-gray"><FileText size={14} /></button>
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
                    <div className="pagination-info">
                        Showing 1 to {bills.length} of {bills.length} entries
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VendorDetail;
