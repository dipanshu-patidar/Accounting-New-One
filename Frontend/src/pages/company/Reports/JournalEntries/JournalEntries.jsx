import React, { useState } from 'react';
import {
    Calendar, Download, Printer, Search, Filter,
    ChevronDown, ChevronUp, FileText
} from 'lucide-react';
import './JournalEntries.css';

const JournalEntries = () => {
    // Mock Data
    const [entries] = useState([
        {
            id: 1,
            date: '2024-01-15',
            voucherNo: 'JV-2024-001',
            type: 'Journal',
            narration: 'Being adjustment made for prepaid rent expense for the month of January.',
            ledgers: [
                { name: 'Rent Expense', nature: 'Debit', amount: 5000.00 },
                { name: 'Prepaid Rent', nature: 'Credit', amount: 5000.00 }
            ]
        },
        {
            id: 2,
            date: '2024-01-15',
            voucherNo: 'JV-2024-002',
            type: 'Journal',
            narration: 'Being depreciation charged on Furniture & Fixtures @ 10% p.a.',
            ledgers: [
                { name: 'Depreciation Expense', nature: 'Debit', amount: 1200.00 },
                { name: 'Furniture & Fixtures', nature: 'Credit', amount: 1200.00 }
            ]
        },
        {
            id: 3,
            date: '2024-01-16',
            voucherNo: 'JV-2024-003',
            type: 'Journal',
            narration: 'Being rectification of error: Office supplies wrongly debited to Computer Equipment.',
            ledgers: [
                { name: 'Office Supplies', nature: 'Debit', amount: 850.00 },
                { name: 'Computer Equipment', nature: 'Credit', amount: 850.00 }
            ]
        },
        {
            id: 4,
            date: '2024-01-18',
            voucherNo: 'CP-005',
            type: 'Contra',
            narration: 'Being cash deposited into Bank Account.',
            ledgers: [
                { name: 'HDFC Bank', nature: 'Debit', amount: 15000.00 },
                { name: 'Cash Account', nature: 'Credit', amount: 15000.00 }
            ]
        }
    ]);

    const [expandedEntries, setExpandedEntries] = useState({});

    const toggleEntry = (id) => {
        setExpandedEntries(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="journal-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Journal Entries</h1>
                    <p className="page-subtitle">General Journal Register</p>
                </div>
                <div className="header-actions">
                    <div className="date-picker-wrapper">
                        <Calendar size={16} />
                        <span>Jan 2024</span>
                    </div>
                    <button className="btn-icon" title="Print"><Printer size={18} /></button>
                    <button className="btn-primary"><Download size={18} /> Export PDF</button>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-card">
                <div className="search-group">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search Voucher No or Amount..." className="search-input" />
                </div>
                <div className="filter-group">
                    <button className="btn-filter"><Filter size={16} /> All Types</button>
                </div>
            </div>

            {/* Entries List */}
            <div className="entries-list">
                {entries.map((entry) => (
                    <div key={entry.id} className="entry-card">
                        <div className="entry-header">
                            <div className="header-left">
                                <div className="date-block">
                                    <span className="date-day">{new Date(entry.date).getDate()}</span>
                                    <span className="date-month">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div className="voucher-info">
                                    <span className="voucher-no">{entry.voucherNo}</span>
                                    <span className={`voucher-type ${entry.type.toLowerCase()}`}>{entry.type}</span>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="total-block">
                                    <span className="label">Amount</span>
                                    <span className="value">${entry.ledgers[0].amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="entry-body">
                            <table className="journal-table">
                                <thead>
                                    <tr>
                                        <th>Particulars</th>
                                        <th className="text-right width-15">Debit ($)</th>
                                        <th className="text-right width-15">Credit ($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entry.ledgers.map((ledger, idx) => (
                                        <tr key={idx} className={ledger.nature === 'Credit' ? 'credit-row' : ''}>
                                            <td className="particulars-cell">
                                                <span className="ledger-name">
                                                    {ledger.nature === 'Credit' ? 'To ' : ''}{ledger.name}
                                                </span>
                                                {ledger.nature === 'Debit' && <span className="dr-tag">Dr</span>}
                                            </td>
                                            <td className="text-right">
                                                {ledger.nature === 'Debit' ? ledger.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : ''}
                                            </td>
                                            <td className="text-right">
                                                {ledger.nature === 'Credit' ? ledger.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : ''}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="narration-box">
                                <span className="narration-label">Narration:</span> {entry.narration}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JournalEntries;
