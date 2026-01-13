import React, { useState, useEffect, useRef } from 'react';
import {
    Building2, Plus, Search, Grid, List as ListIcon, MoreVertical,
    Calendar, Users, HardDrive, X, Upload, Pencil, LogIn, Trash2, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Company.css';

const Company = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [activeCompanyForUsers, setActiveCompanyForUsers] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleLogoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [activeDropdownId, setActiveDropdownId] = useState(null);

    // Click outside handler for dropdown
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const companies = [
        {
            id: 1,
            name: 'Kapil Patidar',
            email: 'kapil@gmail.com',
            plan: 'N/A',
            planColor: 'badge-na',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kapil',
            type: 'Monthly',
            startDate: 'N/A',
            endDate: 'N/A'
        },
        {
            id: 2,
            name: 'zcszd',
            email: 'abc@gmail.com',
            plan: 'Bronze',
            planColor: 'badge-bronze',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zcszd',
            type: 'Monthly',
            startDate: 'Dec 20, 2025',
            endDate: 'Jan 20, 2026'
        },
        {
            id: 3,
            name: 'Tech Innovators Pvt Ltd',
            email: 'hello@gmail.com',
            plan: 'Bronze',
            planColor: 'badge-bronze',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
            type: 'Monthly',
            startDate: 'Dec 9, 2025',
            endDate: 'Dec 9, 2026'
        },
        {
            id: 4,
            name: 'Kiaan',
            email: 'kiaan@gmail.com',
            plan: 'Pro Plan',
            planColor: 'badge-pro',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kiaan',
            type: 'Monthly',
            startDate: 'Nov 20, 2025',
            endDate: 'Dec 20, 2025'
        },
        {
            id: 5,
            name: 'Jay',
            email: 'jay@gmail.com',
            plan: 'Bronze',
            planColor: 'badge-bronze',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jay',
            type: 'Monthly',
            startDate: 'Nov 3, 2025',
            endDate: 'Dec 3, 2025'
        }
    ];

    const usersData = [
        { id: 1, name: 'John', email: 'john@gmail.com', role: 'USER', status: 'Active', created: 'Nov 3, 2025', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { id: 2, name: 'user', email: 'user@gmail.com', role: 'USER', status: 'Active', created: 'Nov 3, 2025', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user' },
    ];

    const handleUsersClick = (company) => {
        setActiveCompanyForUsers(company);
        setShowUsersModal(true);
    };

    const toggleDropdown = (e, id) => {
        e.stopPropagation();
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [editingCompany, setEditingCompany] = useState(null);

    const handleEditClick = (company) => {
        setEditingCompany(company);
        setShowCreateModal(true);
        setActiveDropdownId(null); // Close dropdown
    };

    const handleDeleteClick = (company) => {
        setCompanyToDelete(company);
        setShowDeleteModal(true);
        setActiveDropdownId(null);
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false);
        setEditingCompany(null);
        setLogoPreview(null);
    };

    return (
        <div className="company-page">
            <div className="page-header">
                <div className="page-title">
                    <Building2 size={24} className="text-orange-500" />
                    <span>Manage Companies</span>
                </div>
                <div className="header-actions">
                    <button className="add-btn" onClick={() => { setEditingCompany(null); setShowCreateModal(true); }}>
                        <Plus size={18} />
                        Add Company
                    </button>
                </div>
            </div>

            {/* ... Filters Bar ... */}
            <div className="filters-bar">
                <div className="filter-group" style={{ flex: 1 }}>
                    <span className="filter-label">Search</span>
                    <div className="search-input-wrapper" style={{ width: '100%' }}>
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search companies..."
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Start Date</span>
                    <input type="date" className="form-control-date" />
                </div>

                <div className="filter-group">
                    <span className="filter-label">Expiry Date</span>
                    <input type="date" className="form-control-date" />
                </div>

                <div className="filter-group">
                    <span className="filter-label">Plan</span>
                    <select className="form-select">
                        <option>All Plans</option>
                        <option>Bronze</option>
                        <option>Silver</option>
                        <option>Gold</option>
                    </select>
                </div>
            </div>

            <div className="company-grid">
                {companies.map(company => (
                    <div key={company.id} className="company-card">
                        <div className="card-top">
                            <span className={`plan-badge ${company.planColor}`}>
                                {company.plan}
                            </span>
                            <div className="relative">
                                <button
                                    className="menu-trigger"
                                    onClick={(e) => toggleDropdown(e, company.id)}
                                >
                                    <MoreVertical size={18} />
                                </button>
                                {activeDropdownId === company.id && (
                                    <div className="action-dropdown" ref={dropdownRef}>
                                        <div className="dropdown-item" onClick={() => handleEditClick(company)}>
                                            <Pencil size={14} /> Edit
                                        </div>
                                        <div className="dropdown-item" onClick={() => toast.success('Login as Company clicked')}>
                                            <LogIn size={14} /> Login as Company
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <div className="dropdown-item text-danger" onClick={() => handleDeleteClick(company)}>
                                            <Trash2 size={14} /> Delete
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="company-identity">
                            <img src={company.avatar} alt={company.name} className="company-avatar" />
                            <div className="company-details">
                                <h3>{company.name}</h3>
                                <p className="company-email">{company.email}</p>
                            </div>
                        </div>

                        <div className="info-rows">
                            <div className="info-row">
                                <Calendar size={16} className="info-icon" />
                                <span className="info-label">Type:</span>
                                <span className="info-value">{company.type}</span>
                            </div>
                            <div className="info-row">
                                <Calendar size={16} className="info-icon" />
                                <span className="info-label">Start:</span>
                                <span className="info-value">{company.startDate}</span>
                            </div>
                            <div className="info-row">
                                <Calendar size={16} className="info-icon text-red-500" />
                                <span className="info-label">End:</span>
                                <span className="info-value">{company.endDate}</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="action-btn btn-upgrade">
                                Upgrade
                            </button>
                            <div className="action-btn btn-outline" onClick={() => handleUsersClick(company)}>
                                <Users size={14} />
                                Users
                            </div>
                            <button className="action-btn btn-outline">
                                <HardDrive size={14} />
                                Storage
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Company Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h2>{editingCompany ? 'Edit Company' : 'Create Company'}</h2>
                            <button className="close-btn" onClick={handleCreateModalClose}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-section">
                                <label className="form-label">Company Logo</label>
                                <div className="logo-upload-wrapper">
                                    <div className="logo-placeholder">
                                        {logoPreview || editingCompany?.avatar ? (
                                            <img
                                                src={logoPreview || editingCompany?.avatar}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ) : (
                                            'No Logo'
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                    <button className="upload-btn" onClick={handleLogoClick}>Choose Logo</button>
                                </div>
                                <p className="text-muted text-xs mt-1">Max 4MB, JPG/PNG preferred</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="required">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Company Name"
                                        defaultValue={editingCompany?.name || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="required">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email"
                                        defaultValue={editingCompany?.email || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="required">Start Date</label>
                                    <input type="date" className="form-control" defaultValue={editingCompany ? '2025-01-01' : ''} />
                                </div>
                                <div className="form-group">
                                    <label className="required">Expire Date</label>
                                    <input type="date" className="form-control" defaultValue={editingCompany ? '2026-01-01' : ''} />
                                </div>
                                <div className="form-group">
                                    <label className="required">Plan</label>
                                    <select className="form-select w-full" defaultValue={editingCompany?.plan || ''}>
                                        <option>Select Plan</option>
                                        <option>Bronze</option>
                                        <option>Silver</option>
                                        <option>Gold</option>
                                        <option>Pro Plan</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="required">Plan Type</label>
                                    <select className="form-select w-full" defaultValue={editingCompany ? 'Monthly' : ''}>
                                        <option>Select Type</option>
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className={editingCompany ? '' : "required"}>Password</label>
                                    <input type="password" className="form-control" placeholder={editingCompany ? "Leave blank to keep same" : "Enter password"} />
                                </div>
                                <div className="form-group">
                                    <label className={editingCompany ? '' : "required"}>Confirm Password</label>
                                    <input type="password" className="form-control" placeholder={editingCompany ? "Leave blank to keep same" : "Confirm password"} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={handleCreateModalClose}>Cancel</button>
                            <button
                                className="btn-create"
                                onClick={() => {
                                    toast.success(editingCompany ? 'Company Updated!' : 'Company Created!');
                                    handleCreateModalClose();
                                }}
                            >
                                {editingCompany ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && companyToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h2>Delete Company</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>{companyToDelete.name}</strong>?
                                <br />
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button
                                className="btn-close-gray bg-red-600 hover:bg-red-700 text-white border-none"
                                onClick={() => {
                                    toast.success('Company Deleted Successfully');
                                    setShowDeleteModal(false);
                                }}
                                style={{ backgroundColor: '#ef4444', color: 'white' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Modal ... (Previous Users Modal) ... */}
            {showUsersModal && activeCompanyForUsers && (
                <div className="modal-overlay">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h2>Users of {activeCompanyForUsers.name}</h2>
                            <button className="close-btn-red" onClick={() => setShowUsersModal(false)}>
                                <X size={16} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>PROFILE</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>ROLE</th>
                                        <th>STATUS</th>
                                        <th>CREATED DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersData.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img src={user.avatar} alt="profile" className="table-avatar" />
                                            </td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td><span className="badge-role">{user.role}</span></td>
                                            <td><span className="badge-status">{user.status}</span></td>
                                            <td>{user.created}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close-gray" onClick={() => setShowUsersModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Company;
