import React, { useState } from 'react';
import {
    Search, Filter, Download, Calendar,
    DollarSign, CheckCircle2, XCircle, AlertCircle,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import './SalesReport.css';

const SalesReport = () => {
    // --- Mock Data ---
    const summaryCards = [
        { id: 1, label: 'Total Amount', value: '$5,000.00', color: 'blue', icon: DollarSign },
        { id: 2, label: 'Total Paid', value: '$5,000.00', color: 'green', icon: CheckCircle2 },
        { id: 3, label: 'Total Unpaid', value: '$0.00', color: 'red', icon: XCircle },
        { id: 4, label: 'Overdue', value: '$0.00', color: 'orange', icon: AlertCircle },
    ];

    const [reportData, setReportData] = useState([
        {
            id: 1,
            sku: 'SKU-001',
            customerName: 'John Doe',
            customerNameArabic: 'جون دوي',
            productName: 'Premium Widget',
            category: 'Electronics',
            soldQty: 10,
            soldAmount: 1500.00,
            instockQty: 45,
            status: 'Completed'
        },
        {
            id: 2,
            sku: 'SKU-002',
            customerName: 'Jane Smith',
            customerNameArabic: 'جين سميث',
            productName: 'Super Gadget',
            category: 'Electronics',
            soldQty: 5,
            soldAmount: 2500.00,
            instockQty: 12,
            status: 'Completed'
        },
        {
            id: 3,
            sku: 'SKU-003',
            customerName: 'Acme Corp',
            customerNameArabic: 'شركة أكمي',
            productName: 'Office Chair',
            category: 'Furniture',
            soldQty: 20,
            soldAmount: 1000.00,
            instockQty: 0,
            status: 'Out of Stock'
        }
    ]);

    // Helper for status styles
    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-success';
            case 'Pending': return 'status-warning';
            case 'Out of Stock': return 'status-danger';
            default: return 'status-neutral';
        }
    };

    return (
        <div className="sales-report-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Sales Report</h1>
                    <p className="page-subtitle">Detailed analysis of your sales performance</p>
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
                                <th>SKU</th>
                                <th>Customer Name</th>
                                <th>Customer Name (Arabic)</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th className="text-center">Sold Qty</th>
                                <th className="text-right">Sold Amount</th>
                                <th className="text-center">Instock Qty</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row) => (
                                <tr key={row.id}>
                                    <td className="font-mono text-sm">{row.sku}</td>
                                    <td className="font-medium">{row.customerName}</td>
                                    <td className="arabic-text">{row.customerNameArabic}</td>
                                    <td className="text-blue-600">{row.productName}</td>
                                    <td><span className="category-badge">{row.category}</span></td>
                                    <td className="text-center">{row.soldQty}</td>
                                    <td className="text-right font-bold">${row.soldAmount.toFixed(2)}</td>
                                    <td className="text-center">
                                        <span className={`stock-badge ${row.instockQty > 10 ? 'high' : row.instockQty > 0 ? 'low' : 'out'}`}>
                                            {row.instockQty}
                                        </span>
                                    </td>
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

export default SalesReport;
