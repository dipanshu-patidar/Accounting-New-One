import React, { useState } from 'react';
import { Download, Search, Settings, Home, ChevronRight } from 'lucide-react';
import './CashFlow.css';

const CashFlow = () => {
    const [year, setYear] = useState(2026);
    const [viewMode, setViewMode] = useState('Monthly'); // 'Monthly' or 'Quarterly'

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Mock Data placeholders - all zeros as per image
    const zeroValues = Array(12).fill(0);

    return (
        <div className="cashflow-page">
            {/* Header Section */}
            <div className="report-header">
                <div>
                    <h1 className="page-title">Cash Flow</h1>
                </div>
                <button className="btn-download-green">
                    <Download size={18} />
                </button>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar card">
                <div className="filter-left">
                    <div className="toggle-group">
                        <button
                            className={`toggle-btn ${viewMode === 'Monthly' ? 'active' : ''}`}
                            onClick={() => setViewMode('Monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'Quarterly' ? 'active' : ''}`}
                            onClick={() => setViewMode('Quarterly')}
                        >
                            Quarterly
                        </button>
                    </div>
                </div>
                <div className="filter-right">
                    <div className="year-selector">
                        <label>Year</label>
                        <select className="year-select" value={year} onChange={(e) => setYear(e.target.value)}>
                            <option value={2026}>2026</option>
                            <option value={2025}>2025</option>
                        </select>
                    </div>
                    <button className="btn-icon-square green"><Search size={18} /></button>
                    <button className="btn-icon-square red"><Settings size={18} /></button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="info-cards-row">
                <div className="info-card card">
                    <label>Report :</label>
                    <h3>{viewMode} Cashflow</h3>
                </div>
                <div className="info-card card">
                    <label>Duration :</label>
                    <h3>Jan-{year} to Dec-{year}</h3>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="report-content card">

                {/* Income Section */}
                <div className="section-block">
                    <h3 className="section-heading">Income</h3>
                    <div className="table-responsive">
                        <table className="cashflow-table">
                            <thead>
                                <tr>
                                    <th className="col-category">CATEGORY</th>
                                    {months.map(m => <th key={m}>{m.toUpperCase()}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="row-group">
                                    <td colSpan={13}>Revenue :</td>
                                </tr>
                                <tr className="row-group">
                                    <td colSpan={13}>Invoice :</td>
                                </tr>
                                <tr className="row-subtotal-header">
                                    <td colSpan={13}>Total Income = Revenue + Invoice</td>
                                </tr>
                                <tr className="row-total">
                                    <td className="detail-label">Total Income</td>
                                    {zeroValues.map((v, i) => <td key={i}>$0.00</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expense Section */}
                <div className="section-block">
                    <h3 className="section-heading">Expense</h3>
                    <div className="table-responsive">
                        <table className="cashflow-table">
                            <thead>
                                <tr>
                                    <th className="col-category">CATEGORY</th>
                                    {months.map(m => <th key={m}>{m.toUpperCase()}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="row-group">
                                    <td colSpan={13}>Payment :</td>
                                </tr>
                                <tr className="row-group">
                                    <td colSpan={13}>Bill :</td>
                                </tr>
                                <tr className="row-subtotal-header">
                                    <td colSpan={13}>Total Expense = Payment + Bill</td>
                                </tr>
                                <tr className="row-total">
                                    <td className="detail-label">Total Expenses</td>
                                    {zeroValues.map((v, i) => <td key={i}>$0.00</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Net Profit Section */}
                <div className="section-block last">
                    <div className="table-responsive">
                        <table className="cashflow-table">
                            <tbody className="profit-body">
                                <tr className="row-subtotal-header profit">
                                    <td colSpan={13}>NET PROFIT = TOTAL INCOME - TOTAL EXPENSE</td>
                                </tr>
                                <tr className="row-total profit-total">
                                    <td className="detail-label">Net Profit</td>
                                    {zeroValues.map((v, i) => <td key={i}>$0.00</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CashFlow;
