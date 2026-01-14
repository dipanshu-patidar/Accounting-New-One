import React, { useState } from 'react';
import { Key } from 'lucide-react';
import './ManagePasswords.css';

const ManagePasswords = () => {
    const [requests, setRequests] = useState([]);

    return (
        <div className="manage-passwords-page">
            <div className="page-header">
                <div className="page-title">
                    <h1>Manage Passwords</h1>
                </div>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3 className="card-title">Manage Password Requests</h3>
                </div>

                <div className="table-responsive">
                    <table className="passwords-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>COMPANY</th>
                                <th>EMAIL</th>
                                <th>REQUEST DATE</th>
                                <th>STATUS</th>
                                <th>REASON</th>
                                <th>EMAIL STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((req, index) => (
                                    <tr key={req.id}>
                                        <td>{index + 1}</td>
                                        <td>{req.company}</td>
                                        <td>{req.email}</td>
                                        <td>{req.requestDate}</td>
                                        <td>
                                            <span className={`status-pill status-${req.status.toLowerCase()}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td>{req.reason}</td>
                                        <td>{req.emailStatus}</td>
                                        <td>
                                            <button className="action-btn">View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">
                                        <div className="empty-state">
                                            No password change requests found.
                                        </div>
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

export default ManagePasswords;
