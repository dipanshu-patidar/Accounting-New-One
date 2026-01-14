import React, { useState } from 'react';
import {
    Calendar, Download, Printer, Search, Filter,
    ChevronDown, FileText, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import './DayBook.css';

const DayBook = () => {
    // Mock Data
    const [transactions] = useState([
        {
            id: 1,
            date: '2024-01-14',
            voucherType: 'Sales',
            voucherNo: 'INV-001',
            ledger: 'Cash Account',
            description: 'Cash Sales - General Store',
            debit: 5000.00,
            credit: 0.00
        },
        {
            id: 2,
            date: '2024-01-14',
            voucherType: 'Purchase',
            voucherNo: 'PUR-042',
            ledger: 'Office Supplies Ltd',
            description: 'Stationery purchase',
            debit: 0.00,
            credit: 1200.00
        },
        {
            id: 3,
            date: '2024-01-14',
            voucherType: 'Payment',
            voucherNo: 'PAY-103',
            ledger: 'Rent Expense',
            description: 'Monthly office rent payment',
            debit: 15000.00,
            credit: 0.00
        },
        {
            id: 4,
            date: '2024-01-14',
            voucherType: 'Receipt',
            voucherNo: 'REC-009',
            ledger: 'Consulting Income',
            description: 'Advance received from Client A',
            debit: 0.00,
            credit: 8000.00
        },
        {
            id: 5,
            date: '2024-01-14',
            voucherType: 'Contra',
            voucherNo: 'CNTR-005',
            ledger: 'Bank Account',
            description: 'Cash deposit into bank',
            debit: 2000.00,
            credit: 0.00
        }
    ]);

    const totalDebit = transactions.reduce((acc, item) => acc + item.debit, 0);
    const totalCredit = transactions.reduce((acc, item) => acc + item.credit, 0);

    return (
        <div className="daybook-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Day Book</h1>
                    <p className="page-subtitle">Daily transaction record - Jan 14, 2024</p>
                </div>
                <div className="header-actions">
                    <div className="date-picker-wrapper">
                        <Calendar size={16} />
                        <span>Jan 14, 2024</span>
                    </div>
                    <button className="btn-icon" title="Print"><Printer size={18} /></button>
                    <button className="btn-primary"><Download size={18} /> Export PDF</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-section">
                <div className="summary-card debit">
                    <div className="card-icon"><ArrowUpCircle size={24} /></div>
                    <div className="card-info">
                        <span className="info-label">Total Debit</span>
                        <h3 className="info-value">${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
                <div className="summary-card credit">
                    <div className="card-icon"><ArrowDownCircle size={24} /></div>
                    <div className="card-info">
                        <span className="info-label">Total Credit</span>
                        <h3 className="info-value">${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
                <div className="summary-card net">
                    <div className="card-icon"><FileText size={24} /></div>
                    <div className="card-info">
                        <span className="info-label">Net Movement</span>
                        <h3 className="info-value">${(totalDebit - totalCredit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="table-controls-card">
                <div className="search-group">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search by Voucher No or Ledger..." className="search-input" />
                </div>
                <div className="filter-group">
                    <button className="btn-filter"><Filter size={16} /> Filter Type</button>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Voucher Type</th>
                                <th>Voucher No</th>
                                <th>Particulars (Ledger)</th>
                                <th>Description</th>
                                <th className="text-right">Debit Amount</th>
                                <th className="text-right">Credit Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((row) => (
                                <tr key={row.id}>
                                    <td className="text-gray-500">{row.date}</td>
                                    <td>
                                        <span className={`voucher-badge ${row.voucherType.toLowerCase()}`}>
                                            {row.voucherType}
                                        </span>
                                    </td>
                                    <td className="font-mono">{row.voucherNo}</td>
                                    <td className="font-medium">{row.ledger}</td>
                                    <td className="text-gray-500 text-sm">{row.description}</td>
                                    <td className="text-right font-medium">{row.debit > 0 ? `$${row.debit.toLocaleString()}` : '-'}</td>
                                    <td className="text-right font-medium">{row.credit > 0 ? `$${row.credit.toLocaleString()}` : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="footer-row">
                                <td colSpan={5} className="text-right">Total</td>
                                <td className="text-right">${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="text-right">${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DayBook;
