import React, { useState } from 'react';
import {
    Calendar, Download, Printer, Search, Filter,
    ChevronDown, User, Wallet, Building2
} from 'lucide-react';
import './LedgerReport.css';

const LedgerReport = () => {
    const [selectedLedger, setSelectedLedger] = useState('Cash Account');

    // Mock Data
    const ledgerList = [
        { id: 1, name: 'Cash Account', type: 'Asset' },
        { id: 2, name: 'HDFC Bank', type: 'Bank' },
        { id: 3, name: 'Sales Account', type: 'Revenue' },
        { id: 4, name: 'Office Rent', type: 'Expense' },
        { id: 5, name: 'Tech Solutions Ltd', type: 'Debtor' },
    ];

    const openingBalance = 12500.00; // Dr

    const [transactions] = useState([
        {
            id: 1,
            date: '2024-01-01',
            particulars: 'To Sales Account',
            voucherType: 'Receipt',
            voucherNo: 'REC-001',
            debit: 5000.00,
            credit: 0.00,
        },
        {
            id: 2,
            date: '2024-01-05',
            particulars: 'By Office Rent',
            voucherType: 'Payment',
            voucherNo: 'PAY-004',
            debit: 0.00,
            credit: 2500.00,
        },
        {
            id: 3,
            date: '2024-01-10',
            particulars: 'To Tech Solutions Ltd',
            voucherType: 'Receipt',
            voucherNo: 'REC-012',
            debit: 8200.00,
            credit: 0.00,
        },
        {
            id: 4,
            date: '2024-01-15',
            particulars: 'By Stationery Expenses',
            voucherType: 'Payment',
            voucherNo: 'PAY-009',
            debit: 0.00,
            credit: 450.00,
        },
        {
            id: 5,
            date: '2024-01-20',
            particulars: 'By HDFC Bank (Contra)',
            voucherType: 'Contra',
            voucherNo: 'CNTR-002',
            debit: 0.00,
            credit: 5000.00,
        }
    ]);

    // Calculate details including running balance
    let currentBalance = openingBalance;
    const transactionsWithBalance = transactions.map(txn => {
        // Assuming Debit increases Asset (Cash)
        currentBalance = currentBalance + txn.debit - txn.credit;
        return { ...txn, balance: currentBalance };
    });

    const totalDebit = transactions.reduce((acc, item) => acc + item.debit, 0);
    const totalCredit = transactions.reduce((acc, item) => acc + item.credit, 0);
    const closingBalance = transactionsWithBalance[transactionsWithBalance.length - 1]?.balance || openingBalance;

    return (
        <div className="ledger-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Ledger Report</h1>
                    <p className="page-subtitle">Account Activity & Balance</p>
                </div>
                <div className="header-actions">
                    <button className="btn-icon" title="Print"><Printer size={18} /></button>
                    <button className="btn-primary"><Download size={18} /> Export</button>
                </div>
            </div>

            {/* Selection & Filters */}
            <div className="control-panel">
                <div className="ledger-selector">
                    <label>Select Ledger Account</label>
                    <div className="selector-box">
                        <Wallet size={18} className="selector-icon" />
                        <select
                            value={selectedLedger}
                            onChange={(e) => setSelectedLedger(e.target.value)}
                            className="ledger-dropdown"
                        >
                            {ledgerList.map(l => (
                                <option key={l.id} value={l.name}>{l.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="dropdown-arrow" />
                    </div>
                </div>

                <div className="filter-block">
                    <label>Period</label>
                    <div className="date-display">
                        <Calendar size={16} />
                        <span>Jan 1, 2024 - Jan 31, 2024</span>
                    </div>
                </div>
            </div>

            {/* Ledger Header Info */}
            <div className="ledger-info-card">
                <div className="info-left">
                    <div className="ledger-avatar">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2>{selectedLedger}</h2>
                        <span className="ledger-type">Current Assets</span>
                    </div>
                </div>
                <div className="info-right">
                    <div className="balance-box opening">
                        <span className="lbl">Opening Balance</span>
                        <span className="val">${openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} Dr</span>
                    </div>
                    <div className="balance-box closing">
                        <span className="lbl">Closing Balance</span>
                        <span className="val">${closingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} Dr</span>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Particulars</th>
                                <th>Voucher Type</th>
                                <th>Voucher No</th>
                                <th className="text-right">Debit ($)</th>
                                <th className="text-right">Credit ($)</th>
                                <th className="text-right">Balance ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="opening-row">
                                <td colSpan={4} className="text-center font-medium">Opening Balance</td>
                                <td colSpan={2}></td>
                                <td className="text-right font-bold">${openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} Dr</td>
                            </tr>
                            {transactionsWithBalance.map((row) => (
                                <tr key={row.id}>
                                    <td className="text-gray-500">{row.date}</td>
                                    <td className="font-medium">{row.particulars}</td>
                                    <td>
                                        <span className={`type-tag ${row.voucherType.toLowerCase()}`}>
                                            {row.voucherType}
                                        </span>
                                    </td>
                                    <td className="font-mono text-sm">{row.voucherNo}</td>
                                    <td className="text-right">{row.debit > 0 ? row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                    <td className="text-right">{row.credit > 0 ? row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                    <td className="text-right font-medium text-blue-600">
                                        {row.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} Dr
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="footer-row">
                                <td colSpan={4} className="text-right">Current Period Totals</td>
                                <td className="text-right">${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="text-right">${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LedgerReport;
