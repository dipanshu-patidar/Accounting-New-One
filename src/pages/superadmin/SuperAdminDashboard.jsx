import React from 'react';
import {
    Building2, Users, DollarSign, UserPlus, FileText
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    // Data mockup matching Image 1 trends
    const growthData = [
        { name: 'Jan', val: 0 }, { name: 'Feb', val: 0 }, { name: 'Mar', val: 0 },
        { name: 'Apr', val: 0 }, { name: 'May', val: 0 }, { name: 'Jun', val: 0 },
        { name: 'Jul', val: 0 }, { name: 'Aug', val: 0 }, { name: 'Sept', val: 0 },
        { name: 'Oct', val: 0 }, { name: 'Nov', val: 0 }, { name: 'Dec', val: 0 },
    ];

    const revenueData = [
        { name: 'Jan', val: 50000 }, { name: 'Feb', val: 5000 }, { name: 'Mar', val: 0 },
        { name: 'Apr', val: 0 }, { name: 'May', val: 0 }, { name: 'Jun', val: 0 },
        { name: 'Jul', val: 0 }, { name: 'Aug', val: 0 }, { name: 'Sept', val: 0 },
        { name: 'Oct', val: 0 }, { name: 'Nov', val: 0 }, { name: 'Dec', val: 0 },
    ];

    const StatsCard = ({ title, value, icon: Icon, color, badge, badgeColor }) => (
        <div className="stat-card">
            <div className="stat-header">
                <div className={`icon-box ${color}`}>
                    <Icon size={24} />
                </div>
                {badge && (
                    <span className={`stat-badge ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
            <div className="stat-info">
                <span className="stat-label">{title}</span>
                <span className="stat-value">{value}</span>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* Stats Row - Data from Image 1, Style from Image 2 */}
            <div className="stats-grid">
                <StatsCard
                    title="Total Company"
                    value="5"
                    icon={Building2}
                    color="green"
                    badge="+100.0%"
                    badgeColor="badge-success"
                />
                <StatsCard
                    title="Total Request"
                    value="0"
                    icon={Users}
                    color="blue"
                    badge="+0%"
                    badgeColor="badge-neutral"
                />
                <StatsCard
                    title="Total Revenue"
                    value="$629,421.00"
                    icon={DollarSign}
                    color="orange"
                    badge="+100.0%"
                    badgeColor="badge-success"
                />
                <StatsCard
                    title="New Signups Company"
                    value="0"
                    icon={UserPlus}
                    color="pink"
                    badge="Today"
                    badgeColor="badge-primary"
                />
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Total Growth</h3>
                    </div>
                    <div className="h-64 w-full" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="val" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Signup Company</h3>
                    </div>
                    <div className="h-64 w-full" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card full-width-chart">
                    <div className="chart-header">
                        <h3 className="chart-title">Revenue Trends</h3>
                        <button className="text-sm border rounded px-3 py-1 text-gray-600 hover:bg-gray-50 bg-white">
                            2026
                        </button>
                    </div>
                    <div className="h-64 w-full" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="val" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
