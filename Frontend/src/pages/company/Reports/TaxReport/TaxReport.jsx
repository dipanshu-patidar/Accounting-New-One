import React, { useState } from 'react';
import { Download, Search, Settings, Home, ChevronRight } from 'lucide-react';
import './TaxReport.css';

const TaxReport = () => {
    const [year, setYear] = useState(2026);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const incomeTaxes = [
        { name: 'CGST', values: [2.75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'SGST', values: [1212.75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'Service Tax', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'Effective Tax', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ];

    const expenseTaxes = []; // Empty as per image "Expense tax not found" potentially

    return (
        <div className="tax-report-page">
            {/* Header Section */}
            <div className="report-header">
                <div>
                    <h1 className="page-title">Tax Summary</h1>
                </div>
                <button className="btn-download-green">
                    <Download size={18} />
                </button>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar card">
                <div className="filter-right">
                    <select className="year-select" value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                    </select>
                    <button className="btn-icon-square green"><Search size={18} /></button>
                    <button className="btn-icon-square red"><Settings size={18} /></button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="info-cards-row">
                <div className="info-card card">
                    <label>Report :</label>
                    <h3>Tax Summary</h3>
                </div>
                <div className="info-card card">
                    <label>Duration :</label>
                    <h3>Jan-{year} to Dec-{year}</h3>
                </div>
            </div>

            {/* Income Section */}
            <div className="section-card card">
                <h3 className="section-title">Income</h3>
                <div className="table-responsive">
                    <table className="tax-table">
                        <thead>
                            <tr>
                                <th>TAX</th>
                                {months.map(m => <th key={m}>{m.toUpperCase()}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {incomeTaxes.map((tax, idx) => (
                                <tr key={idx}>
                                    <td className="tax-name">{tax.name}</td>
                                    {tax.values.map((val, vIdx) => (
                                        <td key={vIdx}>
                                            {val === 0 ? '$0.00' : `$${val.toFixed(2)}`}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Expense Section */}
            <div className="section-card card mt-6">
                <h3 className="section-title">Expense</h3>
                <div className="table-responsive">
                    <table className="tax-table">
                        <thead>
                            <tr>
                                <th>TAX</th>
                                {months.map(m => <th key={m}>{m.toUpperCase()}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {expenseTaxes.length > 0 ? (
                                expenseTaxes.map((tax, idx) => (
                                    <tr key={idx}>
                                        <td className="tax-name">{tax.name}</td>
                                        {tax.values.map((val, vIdx) => (
                                            <td key={vIdx}>
                                                {val === 0 ? '$0.00' : `$${val.toFixed(2)}`}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={13} className="text-center py-4 text-muted">
                                        Expense tax not found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TaxReport;
