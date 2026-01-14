import React, { useState } from 'react';
import { Download, Calendar, Search, Filter, Printer } from 'lucide-react';
import './VatReport.css';

const VatReport = () => {
    // Mock Data
    const [vatData] = useState([
        {
            id: 1,
            type: 'Sales',
            description: 'Invoice #INV-2024-001 - Tech Solutions Ltd',
            taxableAmount: 5000.00,
            vatRate: 5,
            vatAmount: 250.00,
            date: '2024-01-15'
        },
        {
            id: 2,
            type: 'Purchase',
            description: 'Bill #BILL-982 - Office Supplies Co',
            taxableAmount: 1200.00,
            vatRate: 5,
            vatAmount: 60.00,
            date: '2024-01-18'
        },
        {
            id: 3,
            type: 'Sales',
            description: 'Invoice #INV-2024-002 - Global Corp',
            taxableAmount: 8500.00,
            vatRate: 0,
            vatAmount: 0.00,
            date: '2024-01-20'
        },
        {
            id: 4,
            type: 'Expense',
            description: 'Server Maintenance',
            taxableAmount: 450.00,
            vatRate: 5,
            vatAmount: 22.50,
            date: '2024-01-22'
        }
    ]);

    const totalTaxable = vatData.reduce((acc, item) => acc + item.taxableAmount, 0);
    const totalVat = vatData.reduce((acc, item) => acc + item.vatAmount, 0);

    return (
        <div className="vat-report-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">VAT Report</h1>
                    <p className="page-subtitle">Value Added Tax detailed statement</p>
                </div>
                <div className="header-actions">
                    <button className="btn-outline">
                        <Printer size={16} /> Print
                    </button>
                    <button className="btn-primary">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-card">
                <div className="filter-group">
                    <div className="date-range-picker">
                        <Calendar size={16} />
                        <span>Jan 1, 2024 - Jan 31, 2024</span>
                    </div>
                </div>
                <div className="search-group">
                    <div className="search-input-wrapper">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search description..." />
                    </div>
                    <button className="btn-filter">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Summary Row */}
            <div className="summary-row">
                <div className="summary-card">
                    <span className="summary-label">Total Taxable Amount</span>
                    <h3 className="summary-value">${totalTaxable.toFixed(2)}</h3>
                </div>
                <div className="summary-card highlight">
                    <span className="summary-label">Total VAT Amount</span>
                    <h3 className="summary-value">${totalVat.toFixed(2)}</h3>
                </div>
            </div>

            {/* Main Table */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th className="text-right">Taxable Amount</th>
                                <th className="text-center">VAT Rate (%)</th>
                                <th className="text-right">VAT Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vatData.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <span className={`type-badge ${row.type.toLowerCase()}`}>
                                            {row.type}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="desc-cell">
                                            <span className="desc-text">{row.description}</span>
                                            <span className="desc-date">{row.date}</span>
                                        </div>
                                    </td>
                                    <td className="text-right font-medium">${row.taxableAmount.toFixed(2)}</td>
                                    <td className="text-center">{row.vatRate}%</td>
                                    <td className="text-right font-bold">${row.vatAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="footer-row">
                                <td colSpan={2} className="text-right">Grand Total</td>
                                <td className="text-right">${totalTaxable.toFixed(2)}</td>
                                <td></td>
                                <td className="text-right">${totalVat.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VatReport;
