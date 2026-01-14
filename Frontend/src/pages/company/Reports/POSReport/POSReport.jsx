import React, { useState } from 'react';
import {
    Search, Filter, Download, Calendar,
    Receipt, FileText, PieChart, Printer,
    Eye, MoreHorizontal
} from 'lucide-react';
import './POSReport.css';

const POSReport = () => {
    // --- Mock Data ---
    const summaryCards = [
        { id: 1, label: 'Total Invoices', value: '0', color: 'blue', icon: Receipt },
        { id: 2, label: 'Total Amount', value: '$ 0.00', color: 'green', icon: FileText },
        { id: 3, label: 'Total GST', value: '$ 0.00', color: 'purple', icon: PieChart },
    ];

    const [reportData, setReportData] = useState([
        {
            id: 1,
            invoiceNo: 'POS-1001',
            product: 'Wireless Mouse',
            paymentType: 'Cash',
            amount: 25.00,
            gst: 2.50,
            total: 27.50,
            time: '10:30 AM',
        },
        {
            id: 2,
            invoiceNo: 'POS-1002',
            product: 'Keyboard',
            paymentType: 'Card',
            amount: 45.00,
            gst: 4.50,
            total: 49.50,
            time: '11:15 AM',
        }
    ]);

    return (
        <div className="pos-report-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">POS Report</h1>
                    <p className="page-subtitle">Point of Sale transactions and analysis</p>
                </div>
                <div className="header-actions">
                    <div className="date-range-picker">
                        <Calendar size={16} />
                        <span>Today</span>
                    </div>
                    <button className="btn-export">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid-three">
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
                        <input type="text" placeholder="Search invoices..." className="search-input" />
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
                                <th>Invoice No</th>
                                <th>Product</th>
                                <th>Payment Type</th>
                                <th className="text-right">Amount</th>
                                <th className="text-right">GST</th>
                                <th className="text-right">Total</th>
                                <th>Time</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row) => (
                                <tr key={row.id}>
                                    <td className="font-mono text-primary">{row.invoiceNo}</td>
                                    <td className="font-medium">{row.product}</td>
                                    <td>
                                        <span className={`payment-badge ${row.paymentType.toLowerCase()}`}>
                                            {row.paymentType}
                                        </span>
                                    </td>
                                    <td className="text-right">${row.amount.toFixed(2)}</td>
                                    <td className="text-right text-gray-600">${row.gst.toFixed(2)}</td>
                                    <td className="text-right font-bold">${row.total.toFixed(2)}</td>
                                    <td className="text-gray-500">{row.time}</td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-icon-view" title="View Receipt">
                                                <Printer size={16} />
                                            </button>
                                            <button className="btn-icon-more" title="More">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
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

export default POSReport;
