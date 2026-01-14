import React, { useState } from 'react';
import {
    Search, Filter, CheckCircle, XCircle, Clock,
    MoreHorizontal, Shield
} from 'lucide-react';
import './PasswordRequests.css';

const PasswordRequests = () => {
    // Mock Data
    const [requests] = useState([
        {
            id: 1,
            date: '2024-01-14 10:30 AM',
            username: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Accountant',
            status: 'Pending'
        },
        {
            id: 2,
            date: '2024-01-13 02:45 PM',
            username: 'Sarah Smith',
            email: 'sarah.s@example.com',
            role: 'Sales Manager',
            status: 'Approved'
        },
        {
            id: 3,
            date: '2024-01-12 09:15 AM',
            username: 'Mike Johnson',
            email: 'mike.j@example.com',
            role: 'Inventory Staff',
            status: 'Rejected'
        }
    ]);

    const getStatusBadge = (status) => {
        if (!status) return null;
        switch (status.toString().toLowerCase()) {
            case 'approved':
                return (
                    <span className="req-status-badge approved">
                        <CheckCircle size={14} strokeWidth={2.5} />
                        <span>Approved</span>
                    </span>
                );
            case 'rejected':
                return (
                    <span className="req-status-badge rejected">
                        <XCircle size={14} strokeWidth={2.5} />
                        <span>Rejected</span>
                    </span>
                );
            default:
                return (
                    <span className="req-status-badge pending">
                        <Clock size={14} strokeWidth={2.5} />
                        <span>Pending</span>
                    </span>
                );
        }
    };

    return (
        <div className="password-requests-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Password Requests</h1>
                    <p className="page-subtitle">Manage user password change requests</p>
                </div>
            </div>

            {/* Controls */}
            <div className="table-controls-card">
                <div className="search-group">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search by name or email..." className="search-input" />
                </div>
                <div className="filter-group">
                    <button className="btn-filter"><Filter size={16} /> Filter Status</button>
                </div>
            </div>

            {/* Requests Table */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Request Date</th>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((row) => (
                                <tr key={row.id}>
                                    <td className="text-gray-500">{row.date}</td>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <span>{row.username.charAt(0)}</span>
                                            </div>
                                            <div className="user-details">
                                                <span className="user-name">{row.username}</span>
                                                <span className="user-email">{row.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="role-tag flex-center">
                                            <Shield size={12} className="mr-1" /> {row.role}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(row.status)}</td>
                                    <td className="text-right">
                                        {row.status === 'Pending' ? (
                                           <div className="action-buttons">
    <button className="btn-action approve" title="Approve">
        ✅ Approve
    </button>

    <button className="btn-action reject" title="Reject">
        ❌ Reject
    </button>
</div>

                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PasswordRequests;
