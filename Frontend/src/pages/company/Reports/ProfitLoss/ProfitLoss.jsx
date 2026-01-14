import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, TrendingDown, DollarSign, Calendar,
    Download, Printer, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import './ProfitLoss.css';

const ProfitLoss = () => {
    const [filterType, setFilterType] = useState('Monthly');

    // Mock Data
    const summaryData = {
        netProfit: 45200.00,
        totalIncome: 125000.00,
        totalExpense: 79800.00,
        profitGrowth: 12.5,
        incomeGrowth: 8.2,
        expenseGrowth: -2.4
    };

    const chartData = [
        { name: 'Jan', income: 4000, expense: 2400 },
        { name: 'Feb', income: 3000, expense: 1398 },
        { name: 'Mar', income: 9000, expense: 9800 },
        { name: 'Apr', income: 2780, expense: 3908 },
        { name: 'May', income: 1890, expense: 4800 },
        { name: 'Jun', income: 2390, expense: 3800 },
        { name: 'Jul', income: 3490, expense: 4300 },
        { name: 'Aug', income: 4500, expense: 2100 },
        { name: 'Sep', income: 5600, expense: 3200 },
        { name: 'Oct', income: 6700, expense: 4100 },
        { name: 'Nov', income: 7800, expense: 5200 },
        { name: 'Dec', income: 8900, expense: 6300 },
    ];

    const incomeCategories = [
        { name: 'Sales Revenue', value: 85000.00 },
        { name: 'Service Revenue', value: 35000.00 },
        { name: 'Other Income', value: 5000.00 },
    ];

    const expenseCategories = [
        { name: 'Cost of Goods Sold', value: 45000.00 },
        { name: 'Salaries & Wages', value: 25000.00 },
        { name: 'Rent', value: 5000.00 },
        { name: 'Utilities', value: 2500.00 },
        { name: 'Marketing', value: 2300.00 },
    ];

    return (
        <div className="profit-loss-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Profit & Loss</h1>
                    <p className="page-subtitle">Financial performance overview</p>
                </div>
                <div className="header-actions">
                    <div className="date-filter">
                        <Calendar size={16} />
                        <select className="date-select">
                            <option>This Year</option>
                            <option>Last Year</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>
                    <button className="btn-icon" title="Print"><Printer size={18} /></button>
                    <button className="btn-primary"><Download size={18} /> Export</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="kpi-card income">
                    <div className="kpi-icon"><TrendingUp size={24} /></div>
                    <div className="kpi-content">
                        <span className="kpi-label">Total Income</span>
                        <h3 className="kpi-value">${summaryData.totalIncome.toLocaleString()}</h3>
                        <span className="kpi-trend positive">
                            <ArrowUpRight size={14} /> {summaryData.incomeGrowth}% vs last year
                        </span>
                    </div>
                </div>
                <div className="kpi-card expense">
                    <div className="kpi-icon"><TrendingDown size={24} /></div>
                    <div className="kpi-content">
                        <span className="kpi-label">Total Expenses</span>
                        <h3 className="kpi-value">${summaryData.totalExpense.toLocaleString()}</h3>
                        <span className="kpi-trend positive">
                            <ArrowDownRight size={14} /> {Math.abs(summaryData.expenseGrowth)}% vs last year
                        </span>
                    </div>
                </div>
                <div className="kpi-card profit">
                    <div className="kpi-icon"><DollarSign size={24} /></div>
                    <div className="kpi-content">
                        <span className="kpi-label">Net Profit</span>
                        <h3 className="kpi-value">${summaryData.netProfit.toLocaleString()}</h3>
                        <span className="kpi-trend positive">
                            <ArrowUpRight size={14} /> {summaryData.profitGrowth}% vs last year
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                <div className="chart-card main-chart">
                    <h3>Income vs Expense</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card secondary-chart">
                    <h3>Net Profit Trend</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="breakdown-grid">
                <div className="breakdown-card">
                    <div className="card-header">
                        <h3>Income Breakdown</h3>
                        <span className="total-badge income">+${summaryData.totalIncome.toLocaleString()}</span>
                    </div>
                    <ul className="category-list">
                        {incomeCategories.map((cat, idx) => (
                            <li key={idx} className="category-item">
                                <span className="cat-name">{cat.name}</span>
                                <span className="cat-value">${cat.value.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="breakdown-card">
                    <div className="card-header">
                        <h3>Expense Breakdown</h3>
                        <span className="total-badge expense">-${summaryData.totalExpense.toLocaleString()}</span>
                    </div>
                    <ul className="category-list">
                        {expenseCategories.map((cat, idx) => (
                            <li key={idx} className="category-item">
                                <span className="cat-name">{cat.name}</span>
                                <span className="cat-value">${cat.value.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfitLoss;
