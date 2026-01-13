import React, { useState } from 'react';
import { Search, Plus, MoreVertical, X, Mail, Calendar, User, ShieldCheck, Pencil, Trash2 } from 'lucide-react';
import './UserList.css';

const UserList = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [loginEnabled, setLoginEnabled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const toggleMenu = (userId) => {
        if (activeMenu === userId) {
            setActiveMenu(null);
        } else {
            setActiveMenu(userId);
        }
    };

    const users = [
        {
            id: 1,
            name: 'John',
            email: 'john@example.com',
            role: 'accountant',
            img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100'
        },
        {
            id: 2,
            name: 'Keanu',
            email: 'keanu2006@gmail.com',
            role: 'accountant',
            img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100'
        },
        {
            id: 3,
            name: 'Stefanie',
            email: 'stefanie1989@gmail.com',
            role: 'accountant',
            img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
        },
        {
            id: 4,
            name: 'Kelly Carpenter',
            email: 'fizab@mailinator.com',
            role: 'accountant',
            img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
        },
        {
            id: 5,
            name: 'Jana Wiggins',
            email: 'zolelebepu@mailinator.com',
            role: 'accountant',
            img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100'
        }
    ];

    return (
        <div className="user-list-page">
            <div className="page-header">
                <h1 className="page-title">Users</h1>
            </div>

            <div className="user-grid">
                {users.map((user) => (
                    <div key={user.id} className="user-card">
                        <div className="card-top">
                            <span className="role-badge">{user.role}</span>
                            <div className="menu-container">
                                <button className="more-btn" onClick={() => toggleMenu(user.id)}>
                                    < MoreVertical size={18} color="#94a3b8" />
                                </button>

                                {activeMenu === user.id && (
                                    <div className="action-dropdown shadow-lg animate-fade-in">
                                        <button className="dropdown-item" onClick={() => { setSelectedUser(user); setShowEditModal(true); setActiveMenu(null); }}>
                                            <Pencil size={14} className="mr-2" /> Edit
                                        </button>
                                        <button className="dropdown-item" onClick={() => { setSelectedUser(user); setShowDeleteModal(true); setActiveMenu(null); }}>
                                            <Trash2 size={14} className="mr-2" /> Delete
                                        </button>
                                        <button className="dropdown-item" onClick={() => { setSelectedUser(user); setShowResetModal(true); setActiveMenu(null); }}>
                                            <ShieldCheck size={14} className="mr-2" /> Reset Password
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item text-red-500" onClick={() => { setActiveMenu(null); }}>
                                            <X size={14} className="mr-2" /> Login Disable
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="avatar-wrapper">
                                <img src={user.img} alt={user.name} className="user-avatar" />
                            </div>
                            <h3 className="user-name">{user.name}</h3>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>
                ))}

                {/* Add New User Card */}
                <div className="user-card add-user-card" onClick={() => setShowAddModal(true)}>
                    <div className="add-icon-wrapper">
                        <Plus size={24} color="white" fill="white" strokeWidth={3} />
                    </div>
                    <h3 className="add-text">New User</h3>
                    <p className="add-subtext">Click here to add New User</p>
                </div>
            </div>

            {/* Create New User Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content user-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Create New User</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Name <span className="text-red-500">*</span></label>
                                    <input type="text" className="form-input" placeholder="Enter User Name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email <span className="text-red-500">*</span></label>
                                    <input type="email" className="form-input" placeholder="Enter User Email" />
                                </div>
                            </div>

                            <div className="form-grid-2 mt-4 items-center">
                                <div className="form-group">
                                    <label className="form-label">User Role <span className="text-red-500">*</span></label>
                                    <select className="form-input">
                                        <option>accountant</option>
                                        <option>manager</option>
                                        <option>admin</option>
                                    </select>
                                    <span className="inline-link-sm mt-1">Create user role here. <a href="#" style={{ color: '#8ce043' }}>Create user role</a></span>
                                </div>
                                <div className="form-group">
                                    <div className="flex items-center justify-between">
                                        <span className="form-label mb-0">Login is enable</span>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={loginEnabled}
                                                onChange={(e) => setLoginEnabled(e.target.checked)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {loginEnabled && (
                                <div className="form-grid-2 mt-4 animate-fade-in">
                                    <div className="form-group">
                                        <label className="form-label">Password <span className="text-red-500">*</span></label>
                                        <input type="password" className="form-input" placeholder="Enter Password" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm Password <span className="text-red-500">*</span></label>
                                        <input type="password" className="form-input" placeholder="Confirm Password" />
                                    </div>
                                </div>
                            )}

                            <div className="form-group mt-4" style={{ maxWidth: '332px' }}>
                                <label className="form-label">Date Of Birth</label>
                                <div className="date-input-wrapper">
                                    <input type="date" className="form-input" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel-dark" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Create</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit User Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content user-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit User</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Name <span className="text-red-500">*</span></label>
                                    <input type="text" className="form-input" defaultValue={selectedUser?.name} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email <span className="text-red-500">*</span></label>
                                    <input type="email" className="form-input" defaultValue={selectedUser?.email} />
                                </div>
                            </div>
                            <div className="form-grid-2 mt-4 items-center">
                                <div className="form-group">
                                    <label className="form-label">User Role <span className="text-red-500">*</span></label>
                                    <select className="form-input" defaultValue={selectedUser?.role}>
                                        <option>accountant</option>
                                        <option>manager</option>
                                        <option>admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className="flex items-center justify-between">
                                        <span className="form-label mb-0">Login is enable</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={true} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel-dark" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Update User</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete User</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body text-center py-6">
                            <div className="delete-icon-circle mx-auto mb-4">
                                <Trash2 size={32} color="#ef4444" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Are you sure?</h3>
                            <p className="text-gray-500 mt-2">You are about to delete user <strong>{selectedUser?.name}</strong>. This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#ef4444' }}>Delete User</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Reset Password</h2>
                            <button className="close-btn" onClick={() => setShowResetModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-sm text-gray-500 mb-4">Reset password for <strong>{selectedUser?.email}</strong></p>
                            <div className="form-group">
                                <label className="form-label">New Password <span className="text-red-500">*</span></label>
                                <input type="password" className="form-input" placeholder="Enter New Password" />
                            </div>
                            <div className="form-group mt-4">
                                <label className="form-label">Confirm New Password <span className="text-red-500">*</span></label>
                                <input type="password" className="form-input" placeholder="Confirm New Password" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowResetModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Reset Password</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
