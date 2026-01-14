import React, { useState } from 'react';
import {
    Calendar, Download, Printer, Search, Filter,
    ArrowRightLeft
} from 'lucide-react';
import './TrialBalance.css';

const TrialBalance = () => {
    // Mock Data
    const [accounts] = useState([
        { id: 1, name: 'Cash on Hand', type: 'Asset', debit: 15400.00, credit: 0.00 },
        { id: 2, name: 'HDFC Bank Account', type: 'Asset', debit: 45000.00, credit: 0.00 },
        { id: 3, name: 'Accounts Receivable', type: 'Asset', debit: 12500.00, credit: 0.00 },
        { id: 4, name: 'Furniture & Fixtures', type: 'Asset', debit: 25000.00, credit: 0.00 },
        { id: 5, name: 'Accounts Payable', type: 'Liability', debit: 0.00, credit: 18000.00 },
        { id: 6, name: 'GST Payable', type: 'Liability', debit: 0.00, credit: 4500.00 },
        { id: 7, name: 'Owner\'s Capital', type: 'Equity', debit: 0.00, credit: 100000.00 },
        { id: 8, name: 'Sales Revenue', type: 'Revenue', debit: 0.00, credit: 85000.00 },
        { id: 9, name: 'Consulting Income', type: 'Revenue', debit: 0.00, credit: 25000.00 },
        { id: 10, name: 'Rent Expense', type: 'Expense', debit: 60000.00, credit: 0.00 },
        { id: 11, name: 'Salary Expense', type: 'Expense', debit: 45000.00, credit: 0.00 },
        { id: 12, name: 'Office Supplies', type: 'Expense', debit: 3500.00, credit: 0.00 },
        { id: 13, name: 'Utilities Expense', type: 'Expense', debit: 12000.00, credit: 0.00 },
        { id: 14, name: 'Depreciation Expense', type: 'Expense', debit: 8000.00, credit: 0.00 },
        { id: 15, name: 'Interest Expenses', type: 'Expense', debit: 6100.00, credit: 0.00 },
    ]);

    const totalDebit = accounts.reduce((acc, item) => acc + item.debit, 0);
    const totalCredit = accounts.reduce((acc, item) => acc + item.credit, 0);
    const isBalanced = totalDebit === totalCredit;

    return (
        <div className="trial-balance-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Trial Balance</h1>
                    <p className="page-subtitle">As of Jan 14, 2026</p>
                </div>
                <div className="header-actions">
                    <div className="date-picker-wrapper">
                        <Calendar size={16} />
                        <span>Jan 14, 2026</span>
                    </div>
                    <button className="btn-icon" title="Print"><Printer size={18} /></button>
                    <button className="btn-primary"><Download size={18} /> Export PDF</button>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-card">
                <div className="search-group">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search Account Name..." className="search-input" />
                </div>
                <div className="filter-group">
                    <button className="btn-filter"><Filter size={16} /> Filter Group</button>
                </div>
            </div>

            {/* Main Table */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Account Name</th>
                                <th>Account Type</th>
                                <th className="text-right">Debit ($)</th>
                                <th className="text-right">Credit ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((row) => (
                                <tr key={row.id}>
                                    <td className="font-medium text-slate-700">{row.name}</td>
                                    <td>
                                        <span className={`type-badge ${row.type.toLowerCase()}`}>
                                            {row.type}
                                        </span>
                                    </td>
                                    <td className="text-right">{row.debit > 0 ? row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                    <td className="text-right">{row.credit > 0 ? row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="footer-row">
                                <td colSpan={2} className="text-right uppercase tracking-wider">Total</td>
                                <td className="text-right text-blue-700">${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="text-right text-blue-700">${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Balance Status */}
            <div className={`status-bar ${isBalanced ? 'balanced' : 'unbalanced'}`}>
                <div className="icon-wrapper">
                    <ArrowRightLeft size={20} />
                </div>
                {isBalanced ? (
                    <div className="status-info">
                        <strong>Trial Balance is matched</strong>
                        <span>Total Debits equal Total Credits.</span>
                    </div>
                ) : (
                    <div className="status-info">
                        <strong>Difference Detected</strong>
                        <span>Debits and Credits do not match. Difference: ${Math.abs(totalDebit - totalCredit).toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrialBalance;
