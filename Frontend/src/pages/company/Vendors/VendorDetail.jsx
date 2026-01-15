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
        <div className="VendorDetail-vendor-detail-page">
            <div className="VendorDetail-detail-header">
                <div className="VendorDetail-header-left">
                    <h1 className="VendorDetail-page-title">Manage Vendor-Detail</h1>
                </div>
                <div className="VendorDetail-header-actions">
                    <button className="VendorDetail-btn-action VendorDetail-bg-green" onClick={() => navigate('/company/purchases/bill')}>Create Bill</button>
                    <button className="VendorDetail-btn-back" onClick={() => navigate('/company/accounts/vendors')}>Back</button>
                </div>
            </div>

            <div className="VendorDetail-info-cards-grid">
                <div className="VendorDetail-info-card">
                    <h3 className="VendorDetail-card-title">Vendor Info</h3>
                    <div className="VendorDetail-card-body">
                        <p className="VendorDetail-info-text">{vendor.name}</p>
                        <p className="VendorDetail-info-text">{vendor.email}</p>
                        <p className="VendorDetail-info-text">{vendor.phone}</p>
                        <p className="VendorDetail-info-subtext">560</p>
                    </div>
                </div>
                <div className="VendorDetail-info-card">
                    <h3 className="VendorDetail-card-title">Billing Info</h3>
                    <div className="VendorDetail-card-body">
                        <p className="VendorDetail-info-text">{vendor.billing.name}</p>
                        <p className="VendorDetail-info-text">{vendor.billing.phone}</p>
                        <p className="VendorDetail-info-text">{vendor.billing.address}</p>
                    </div>
                </div>
                <div className="VendorDetail-info-card">
                    <h3 className="VendorDetail-card-title">Shipping Info</h3>
                    <div className="VendorDetail-card-body">
                        <p className="VendorDetail-info-text">{vendor.shipping.name}</p>
                        <p className="VendorDetail-info-text">ds</p>
                        <p className="VendorDetail-info-text">{vendor.shipping.address}</p>
                        <p className="VendorDetail-info-text">{vendor.shipping.phone}</p>
                    </div>
                </div>
            </div>

            <div className="VendorDetail-company-info-card">
                <h3 className="VendorDetail-card-title">Company Info</h3>
                <div className="VendorDetail-metrics-grid">
                    <div className="VendorDetail-metric-item">
                        <label>Vendor Id</label>
                        <p>{vendor.vendorId}</p>
                    </div>
                    <div className="VendorDetail-metric-item">
                        <label>Date of Creation</label>
                        <p>{vendor.creationDate}</p>
                    </div>
                    <div className="VendorDetail-metric-item">
                        <label>Balance</label>
                        <p className="VendorDetail-text-bold">${vendor.balance}</p>
                    </div>
                    <div className="VendorDetail-metric-item">
                        <label>Overdue</label>
                        <p className="VendorDetail-text-bold VendorDetail-text-red">${vendor.overdue}</p>
                    </div>
                    <div className="VendorDetail-metric-item">
                        <label>Total Sum of Bills</label>
                        <p className="VendorDetail-text-bold">${vendor.totalBills}</p>
                    </div>
                    <div className="VendorDetail-metric-item">
                        <label>Quantity of Bills</label>
                        <p>{vendor.billQuantity}</p>
                    </div>
                    <div className="VendorDetail-metric-item">
                        <label>Average Sales</label>
                        <p className="VendorDetail-text-bold">${vendor.averageSales}</p>
                    </div>
                    <div className="VendorDetail-metric-item">
                        <label>Paid Amount</label>
                        <p className="VendorDetail-text-bold VendorDetail-text-green">${vendor.paidAmount}</p>
                    </div>
                </div>
            </div>

            <section className="VendorDetail-detail-section">
                <h2 className="VendorDetail-section-title">Bills</h2>

                <div className="VendorDetail-bills-card">
                    <div className="VendorDetail-controls-row">
                        <div className="VendorDetail-entries-control">
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="VendorDetail-entries-select"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="VendorDetail-entries-text">entries per page</span>
                        </div>
                        <div className="VendorDetail-search-control">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="VendorDetail-search-input"
                            />
                        </div>
                    </div>

                    <div className="VendorDetail-table-responsive">
                        <table className="VendorDetail-detail-table">
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
                                            <div className="VendorDetail-voucher-badge-small">
                                                {bill.id}
                                            </div>
                                        </td>
                                        <td>{bill.date}</td>
                                        <td className="VendorDetail-text-red">{bill.dueDate}</td>
                                        <td>{bill.amountDue}</td>
                                        <td>
                                            <span className={`VendorDetail-status-badge-modern ${bill.status.toLowerCase().replace(' ', '-')}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="VendorDetail-table-actions">
                                                <button className="VendorDetail-table-icon-btn VendorDetail-bg-gray"><FileText size={14} /></button>
                                                <button className="VendorDetail-table-icon-btn VendorDetail-bg-orange"><Eye size={14} /></button>
                                                <button className="VendorDetail-table-icon-btn VendorDetail-bg-cyan"><Pencil size={14} /></button>
                                                <button className="VendorDetail-table-icon-btn VendorDetail-bg-pink"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="VendorDetail-pagination-info">
                        Showing 1 to {bills.length} of {bills.length} entries
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VendorDetail;
