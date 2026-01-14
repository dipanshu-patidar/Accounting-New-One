import React, { useState } from 'react';
import {
    Calendar, Download, Printer, Share2,
    ChevronDown, ChevronRight, TrendingUp
} from 'lucide-react';
import './BalanceSheet.css';

const BalanceSheet = () => {
    const [expandedSections, setExpandedSections] = useState({
        currentAssets: true,
        fixedAssets: true,
        currentLiabilities: true,
        equity: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // --- Mock Data ---
    const balanceData = {
        assets: {
            current: [
                { name: 'Cash and Cash Equivalents', value: 45000.00 },
                { name: 'Accounts Receivable', value: 12500.00 },
                { name: 'Inventory', value: 28000.00 },
                { name: 'Prepaid Expenses', value: 1500.00 }
            ],
            fixed: [
                { name: 'Property, Plant & Equipment', value: 150000.00 },
                { name: 'Intangible Assets', value: 25000.00 }
            ]
        },
        liabilities: {
            current: [
                { name: 'Accounts Payable', value: 18000.00 },
                { name: 'Short-term Loans', value: 5000.00 },
                { name: 'Accrued Liabilities', value: 2500.00 }
            ],
            longTerm: [
                { name: 'Long-term Debt', value: 85000.00 }
            ]
        },
        equity: [
            { name: 'Owner\'s Capital', value: 100000.00 },
            { name: 'Retained Earnings', value: 51500.00 }
        ]
    };

    // Calculations
    const totalCurrentAssets = balanceData.assets.current.reduce((acc, item) => acc + item.value, 0);
    const totalFixedAssets = balanceData.assets.fixed.reduce((acc, item) => acc + item.value, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const totalCurrentLiabilities = balanceData.liabilities.current.reduce((acc, item) => acc + item.value, 0);
    const totalLongTermLiabilities = balanceData.liabilities.longTerm.reduce((acc, item) => acc + item.value, 0);
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

    const totalEquity = balanceData.equity.reduce((acc, item) => acc + item.value, 0);
    const totalLiabilitiesEquity = totalLiabilities + totalEquity;

    const SectionHeader = ({ title, sectionKey, total }) => (
        <div className="section-header" onClick={() => toggleSection(sectionKey)}>
            <div className="flex-center">
                {expandedSections[sectionKey] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="section-title-text">{title}</span>
            </div>
            <span className="section-total">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
    );

    const RowItem = ({ item }) => (
        <div className="sheet-row">
            <span className="row-name">{item.name}</span>
            <span className="row-value">${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
    );

    return (
        <div className="balance-sheet-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Balance Sheet</h1>
                    <p className="page-subtitle">Statement of financial position as of Today</p>
                </div>
                <div className="header-actions">
                    <div className="date-picker-wrapper">
                        <Calendar size={16} />
                        <span>As of Jan 14, 2026</span>
                    </div>
                    <button className="btn-icon" title="Print"><Printer size={18} /></button>
                    <button className="btn-icon" title="Share"><Share2 size={18} /></button>
                    <button className="btn-primary"><Download size={18} /> Export PDF</button>
                </div>
            </div>

            <div className="sheet-container">
                {/* Assets Column */}
                <div className="sheet-column">
                    <h2 className="column-header assets">Assets</h2>

                    <div className="sheet-card">
                        <SectionHeader title="Current Assets" sectionKey="currentAssets" total={totalCurrentAssets} />
                        {expandedSections.currentAssets && (
                            <div className="section-content">
                                {balanceData.assets.current.map((item, idx) => <RowItem key={idx} item={item} />)}
                            </div>
                        )}

                        <div className="divider"></div>

                        <SectionHeader title="Fixed Assets" sectionKey="fixedAssets" total={totalFixedAssets} />
                        {expandedSections.fixedAssets && (
                            <div className="section-content">
                                {balanceData.assets.fixed.map((item, idx) => <RowItem key={idx} item={item} />)}
                            </div>
                        )}

                        <div className="total-row main">
                            <div className="row-line top">
                                <span className="label-total">Total</span>
                                <span className="total-amount">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="row-line bottom">
                                <span className="label-section">Assets</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liabilities & Equity Column */}
                <div className="sheet-column">
                    <h2 className="column-header liabilities">Liabilities & Equity</h2>

                    <div className="sheet-card">
                        <SectionHeader title="Current Liabilities" sectionKey="currentLiabilities" total={totalCurrentLiabilities} />
                        {expandedSections.currentLiabilities && (
                            <div className="section-content">
                                {balanceData.liabilities.current.map((item, idx) => <RowItem key={idx} item={item} />)}
                            </div>
                        )}

                        <SectionHeader title="Long-term Liabilities" sectionKey="longTermLiabilities" total={totalLongTermLiabilities} />
                        <div className="section-content">
                            {balanceData.liabilities.longTerm.map((item, idx) => <RowItem key={idx} item={item} />)}
                        </div>

                        <div className="total-row sub">
                            <span>Total Liabilities</span>
                            <span>${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>

                        <div className="divider"></div>

                        <SectionHeader title="Equity" sectionKey="equity" total={totalEquity} />
                        {expandedSections.equity && (
                            <div className="section-content">
                                {balanceData.equity.map((item, idx) => <RowItem key={idx} item={item} />)}
                            </div>
                        )}

                        <div className="total-row main">
                            <div className="row-line top">
                                <span className="label-total">Total</span>
                                <span className="total-amount">${totalLiabilitiesEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="row-line bottom">
                                <span className="label-section">Liabilities & Equity</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Check Balance Status */}
            <div className={`balance-status ${totalAssets === totalLiabilitiesEquity ? 'status-balanced' : 'status-unbalanced'}`}>
                {totalAssets === totalLiabilitiesEquity ? (
                    <>
                        <div className="status-icon success"><TrendingUp size={20} /></div>
                        <div className="status-text">
                            <h4>Books are Balanced</h4>
                            <p>Total Assets align perfectly with Total Liabilities & Equity.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="status-icon error">!</div>
                        <div className="status-text">
                            <h4>Discrepancy Detected</h4>
                            <p>Assets do not equal Liabilities + Equity. Please review entries.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BalanceSheet;
