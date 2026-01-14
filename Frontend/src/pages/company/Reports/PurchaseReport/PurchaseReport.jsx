import React, { useState } from 'react';
import {
    Search, Filter, Download, Calendar,
    DollarSign, CheckCircle2, XCircle, AlertCircle,
    ShoppingBag
} from 'lucide-react';
import './PurchaseReport.css';

const PurchaseReport = () => {
    // --- Mock Data ---
    const summaryCards = [
        { id: 1, label: 'Total Purchase', value: '$4,500.00', color: 'blue', icon: ShoppingBag },
        { id: 2, label: 'Paid Amount', value: '$0.00', color: 'green', icon: CheckCircle2 },
        { id: 3, label: 'Pending Payment', value: '$4,500.00', color: 'orange', icon: AlertCircle },
        { id: 4, label: 'Overdue', value: '$0.00', color: 'red', icon: XCircle },
    ];

    const [reportData, setReportData] = useState([
        {
            id: 1,
            poNumber: 'PO-00123',
            vendor: 'Global Suppliers Ltd',
            vendorArabic: 'الموردين العالمية المحدودة',
            product: 'Office Desk',
            category: 'Furniture',
            qtyOrdered: 10,
            unitPrice: 450.00,
            totalAmount: 4500.00,
            status: 'Pending'
        },
        {
            id: 2,
            poNumber: 'PO-00124',
            vendor: 'Tech Solutions',
            vendorArabic: 'حلول التقنية',
            product: 'Monitor 24"',
            category: 'Electronics',
            qtyOrdered: 5,
            unitPrice: 150.00,
            totalAmount: 750.00,
            status: 'Received'
        }
    ]);

    // Helper for status styles
    const getStatusClass = (status) => {
        switch (status) {
            case 'Received': return 'status-success';
            case 'Pending': return 'status-warning';
            case 'Cancelled': return 'status-danger';
            default: return 'status-neutral';
        }
    };

    return (
        <div className="purchase-report-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Purchase Report</h1>
                    <p className="page-subtitle">Detailed analysis of your procurement</p>
                </div>
                <div className="header-actions">
                    <div className="date-range-picker">
                        <Calendar size={16} />
                        <span>This Month</span>
                    </div>
                    <button className="btn-export">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                {summaryCards.map((card) => (
                    <div key={card.id} className={`summary-card card-${card.color}`}>
                        <div className="card-content">
                            <span className="card-label">{card.label}</span>
                            <h3 className="card-value">{card.value}</h3>
                        </div>
                        <div className={`card-icon icon-${card.color}`}>
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="report-table-card">
                {/* Table Controls */}
                <div className="table-controls">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search report..." className="search-input" />
                    </div>
                    <div className="controls-right">
                        <button className="btn-outline"><Filter size={16} /> Filter</button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>PO #</th>
                                <th>Vendor</th>
                                <th>Vendor (Arabic)</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th className="text-center">Qty Ordered</th>
                                <th className="text-right">Unit Price</th>
                                <th className="text-right">Total Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row) => (
                                <tr key={row.id}>
                                    <td className="font-mono text-primary text-sm">{row.poNumber}</td>
                                    <td className="font-medium">{row.vendor}</td>
                                    <td className="arabic-text">{row.vendorArabic}</td>
                                    <td className="text-blue-600">{row.product}</td>
                                    <td><span className="category-badge">{row.category}</span></td>
                                    <td className="text-center">{row.qtyOrdered}</td>
                                    <td className="text-right text-gray-600">${row.unitPrice.toFixed(2)}</td>
                                    <td className="text-right font-bold">${row.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-pill ${getStatusClass(row.status)}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Simple Pagination */}
                <div className="table-footer">
                    <span className="footer-text">Showing 1 to {reportData.length} of {reportData.length} entries</span>
                    <div className="pagination">
                        <button disabled>Previous</button>
                        <button className="active">1</button>
                        <button disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseReport;
