import React from 'react';
import {
    ShoppingBag,
    FileText,
    FileSpreadsheet,
    Users,
    Briefcase,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import './CompanyDashboard.css';
import GetCompanyId from '../../../api/GetCompanyId';

const CompanyDashboard = () => {
    const companyId = GetCompanyId();
    // Mock Data from Image 1
    const reportData = [
        { name: 'Jan', Purchase: 0, Sales: 0 },
        { name: 'Feb', Purchase: 0, Sales: 0 },
        { name: 'Mar', Purchase: 0, Sales: 0 },
        { name: 'Apr', Purchase: 6000, Sales: 3000 }, // Mocking non-zero for visual check based on grey bar in Image 1
        { name: 'May', Purchase: 0, Sales: 0 },
        { name: 'Jun', Purchase: 0, Sales: 0 },
        { name: 'Jul', Purchase: 0, Sales: 0 },
        { name: 'Aug', Purchase: 0, Sales: 0 },
        { name: 'Sep', Purchase: 0, Sales: 0 },
        { name: 'Oct', Purchase: 0, Sales: 0 },
        { name: 'Nov', Purchase: 0, Sales: 0 },
        { name: 'Dec', Purchase: 4500, Sales: 0 }, // Green bar in image 1 at Dec?
    ];

    const statisticsData = [
        { name: 'Jan', Revenue: 0, Expense: 0 },
        { name: 'Feb', Revenue: 0, Expense: 0 },
        { name: 'Dec', Revenue: 0, Expense: 4490 },
    ];

    console.log(" Company Id :", companyId)

    return (
        <div className="Company-Dashboard-company-dashboard">
            <div className="Company-Dashboard-dashboard-header">
                <div className="Company-Dashboard-dashboard-title">ZirakBook Dashboard</div>
            </div>

            {/* Top Metrics Grid */}
            <div className="Company-Dashboard-metrics-grid">
                <div className="Company-Dashboard-metric-card">
                    <div className="Company-Dashboard-metric-info">
                        <h3>4,930.00</h3>
                        <p>Total Purchase Due</p>
                    </div>
                    <div className="Company-Dashboard-metric-icon Company-Dashboard-icon-yellow">
                        <ShoppingBag size={24} />
                    </div>
                </div>
                <div className="Company-Dashboard-metric-card">
                    <div className="Company-Dashboard-metric-info">
                        <h3>0.00</h3>
                        <p>Total Sales Due</p>
                    </div>
                    <div className="Company-Dashboard-metric-icon Company-Dashboard-icon-green">
                        <FileText size={24} />
                    </div>
                </div>
                <div className="Company-Dashboard-metric-card">
                    <div className="Company-Dashboard-metric-info">
                        <h3>0.00</h3>
                        <p>Total Sale Amount</p>
                    </div>
                    <div className="Company-Dashboard-metric-icon Company-Dashboard-icon-blue">
                        <FileSpreadsheet size={24} />
                    </div>
                </div>
                <div className="Company-Dashboard-metric-card">
                    <div className="Company-Dashboard-metric-info">
                        <h3>0.00</h3>
                        <p>Total Expense</p>
                    </div>
                    <div className="Company-Dashboard-metric-icon Company-Dashboard-icon-red">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* Counts Grid */}
            <div className="Company-Dashboard-secondary-metrics-grid">
                <div className="Company-Dashboard-secondary-card">
                    <div className="Company-Dashboard-secondary-info">
                        <h4>2</h4>
                        <span>Customers</span>
                    </div>
                    <div className="Company-Dashboard-secondary-icon Company-Dashboard-text-warning">
                        <Users size={24} color="#f59e0b" />
                    </div>
                </div>
                <div className="Company-Dashboard-secondary-card">
                    <div className="Company-Dashboard-secondary-info">
                        <h4>1</h4>
                        <span>Vendors</span>
                    </div>
                    <div className="Company-Dashboard-secondary-icon Company-Dashboard-text-info">
                        <Briefcase size={24} color="#3b82f6" />
                    </div>
                </div>
                <div className="Company-Dashboard-secondary-card">
                    <div className="Company-Dashboard-secondary-info">
                        <h4>1</h4>
                        <span>Purchase Invoice</span>
                    </div>
                    <div className="Company-Dashboard-secondary-icon Company-Dashboard-text-primary">
                        <FileText size={24} color="#8ce043" />
                    </div>
                </div>
                <div className="Company-Dashboard-secondary-card">
                    <div className="Company-Dashboard-secondary-info">
                        <h4>1</h4>
                        <span>Sales Invoice</span>
                    </div>
                    <div className="Company-Dashboard-secondary-icon Company-Dashboard-text-success">
                        <FileText size={24} color="#10b981" />
                    </div>
                </div>
            </div>

            {/* Sales & Purchase Report Chart */}
            <div className="Company-Dashboard-charts-section">
                <div className="Company-Dashboard-chart-card">
                    <div className="Company-Dashboard-chart-header">
                        <h3 className="Company-Dashboard-chart-title">Sales & Purchase Report</h3>
                        <div className="Company-Dashboard-chart-actions">
                            <select defaultValue="2025">
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={reportData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Purchase" fill="#8ce043" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="Sales" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="Company-Dashboard-widgets-grid">
                {/* Top Selling Products */}
                <div className="Company-Dashboard-list-card">
                    <div className="Company-Dashboard-list-header" style={{ borderLeftColor: '#ef4444' }}> {/* Red accent as per image 1 hint */}
                        <div className="Company-Dashboard-list-title">
                            Top Selling Products
                        </div>
                        <div className="Company-Dashboard-chart-actions">
                            <select defaultValue="Today">
                                <option>Today</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                    </div>
                    <div className="Company-Dashboard-list-body">
                        <p className="Company-Dashboard-empty-message">No top products</p>
                    </div>
                </div>

                {/* Low Stock */}
                <div className="Company-Dashboard-list-card">
                    <div className="Company-Dashboard-list-header" style={{ borderLeftColor: '#f59e0b' }}>
                        <div className="Company-Dashboard-list-title">
                            Low Stock Products
                        </div>
                        <div className="Company-Dashboard-chart-actions">
                            <span className="Company-Dashboard-text-primary Company-Dashboard-text-sm Company-Dashboard-cursor-pointer" style={{ color: '#3b82f6' }}>View All</span>
                        </div>
                    </div>
                    <div className="Company-Dashboard-list-body">
                        <p className="Company-Dashboard-empty-message">No low stock items</p>
                    </div>
                </div>

                {/* Sales Statistics */}
                <div className="Company-Dashboard-chart-card">
                    <div className="Company-Dashboard-chart-header" style={{ borderLeftColor: '#ef4444' }}>
                        <h3 className="Company-Dashboard-chart-title">Sales Statistics</h3>
                        <div className="Company-Dashboard-chart-actions">
                            <select defaultValue="2025">
                                <option>2025</option>
                            </select>
                        </div>
                    </div>
                    <div className="Company-Dashboard-stats-summary">
                        <div className="Company-Dashboard-stat-item">
                            <p className="Company-Dashboard-stat-label">Revenue</p>
                            <p className="Company-Dashboard-stat-value">0.00</p>
                        </div>
                        <div className="Company-Dashboard-stat-item">
                            <p className="Company-Dashboard-stat-label">Expense</p>
                            <p className="Company-Dashboard-stat-value">4,490.00</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={statisticsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="Expense" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                {/* Top Customers */}
                <div className="Company-Dashboard-list-card">
                    <div className="Company-Dashboard-list-header" style={{ borderLeftColor: '#ec4899' }}>
                        <div className="Company-Dashboard-list-title">
                            Top Customers
                        </div>
                        <div className="Company-Dashboard-chart-actions">
                            <span className="Company-Dashboard-text-primary Company-Dashboard-text-sm Company-Dashboard-cursor-pointer" style={{ color: '#3b82f6' }}>View All</span>
                        </div>
                    </div>
                    <div className="Company-Dashboard-list-body">
                        <p className="Company-Dashboard-empty-message">No top customers</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
