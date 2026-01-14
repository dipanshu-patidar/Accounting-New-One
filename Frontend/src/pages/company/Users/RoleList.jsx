import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, ChevronDown } from 'lucide-react';
import './RoleList.css';

const RoleList = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [selectedRole, setSelectedRole] = useState(null);

    const roles = [
        {
            id: 1,
            name: 'accountant',
            permissions: [
                'show dashboard', 'manage account', 'edit account', 'change password account', 'manage expense',
                'create expense', 'edit expense', 'delete expense', 'manage invoice', 'create invoice',
                'edit invoice', 'delete invoice', 'show invoice', 'convert invoice', 'create payment invoice',
                'delete payment invoice', 'send invoice', 'delete invoice product', 'manage change password',
                'manage product & service', 'create product & service', 'edit product & service', 'delete product & service'
            ]
        }
    ];

    const modules = [
        { name: 'Dashboard', permissions: ['Show'] },
        { name: 'User', permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
        { name: 'Role', permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
        { name: 'Accounts', subModules: ['Charts of Accounts', 'Customers/Debtors', 'Vendors/Creditors', 'All Transaction'], permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
        { name: 'Inventory', subModules: ['Warehouse', 'Unit of measure', 'Product & Inventory', 'Service', 'StockTransfer', 'Inventory Adjustment'], permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
        { name: 'Sales', subModules: ['Quotation', 'Sales Order', 'Delivery Challan', 'Invoice', 'Payment', 'Sales Return'], permissions: ['Manage', 'Create', 'Edit', 'Delete', 'Show', 'Send', 'Duplicate', 'Convert'] },
        { name: 'Purchases', subModules: ['Purchase Quotation', 'Purchase Order', 'Goods Receipt', 'Bill', 'Payment', 'Purchase Return'], permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
        { name: 'POS Screen', permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
        { name: 'Voucher', subModules: ['Create Voucher', 'Expenses', 'Income', 'Contra Voucher'], permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
        { name: 'Reports', subModules: ['Sales Report', 'Purchase Report', 'POS Report', 'Tax Report', 'Inventory Summary', 'Balance Sheet', 'Cash Flow', 'Profit & Loss', 'Vat Report', 'DayBook', 'Journal Entries', 'Ledger', 'Trial Balance'], permissions: ['Manage'] },
        { name: 'Settings', subModules: ['Company Info', 'Password Requests'], permissions: ['Manage', 'Edit'] }
    ];

    return (
        <div className="role-list-page">
            <div className="page-header">
                <h1 className="page-title">Role & Permission</h1>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} className="mr-2" /> Create Role
                </button>
            </div>

            <div className="table-card">
                <div className="table-controls">
                    <div className="entries-control">
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(e.target.value)}
                            className="entries-select"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="entries-text">entries per page</span>
                    </div>
                    <div className="search-control">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="role-table">
                        <thead>
                            <tr>
                                <th>ROLE</th>
                                <th>PERMISSIONS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td className="role-name-cell">{role.name}</td>
                                    <td>
                                        <div className="permissions-badge-grid">
                                            {role.permissions.map((perm, index) => (
                                                <span key={index} className="perm-badge">{perm}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon-edit"
                                                onClick={() => { setSelectedRole(role); setShowEditModal(true); }}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="btn-icon-delete"
                                                onClick={() => { setSelectedRole(role); setShowDeleteModal(true); }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <p className="footer-info">Showing 1 to 1 of 1 entries</p>
                </div>
            </div>

            {/* Create Role Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content role-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Create Role</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="role-form-container">
                                <div className="form-group mb-6">
                                    <label className="form-label">Name<span className="text-red-500">*</span></label>
                                    <input type="text" className="form-input" placeholder="Enter Role Name" />
                                </div>

                                <div className="permissions-section">
                                    <h3 className="section-title">Assign Permission to Roles</h3>
                                    <div className="permissions-table-container">
                                        <table className="permissions-entry-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '40px' }}>
                                                        <input type="checkbox" className="custom-checkbox" />
                                                    </th>
                                                    <th style={{ width: '200px' }}>MODULE</th>
                                                    <th>PERMISSIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modules.map((mod, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <input type="checkbox" className="custom-checkbox" />
                                                        </td>
                                                        <td className="module-name-cell">
                                                            {mod.name}
                                                            {mod.subModules && <span className="text-xs text-gray-400 block font-normal">{mod.subModules.join(', ')}</span>}
                                                        </td>
                                                        <td>
                                                            <div className="permission-checkbox-group">
                                                                {mod.permissions.map((perm, pIdx) => (
                                                                    <label key={pIdx} className="perm-checkbox-item">
                                                                        <input type="checkbox" className="custom-checkbox" />
                                                                        <span>{perm}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Create</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Role Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content role-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Role</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="role-form-container">
                                <div className="form-group mb-6">
                                    <label className="form-label">Name<span className="text-red-500">*</span></label>
                                    <input type="text" className="form-input" defaultValue={selectedRole?.name} placeholder="Enter Role Name" />
                                </div>

                                <div className="permissions-section">
                                    <h3 className="section-title">Assign Permission to Roles</h3>
                                    <div className="permissions-table-container">
                                        <table className="permissions-entry-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '40px' }}>
                                                        <input type="checkbox" className="custom-checkbox" defaultChecked />
                                                    </th>
                                                    <th style={{ width: '200px' }}>MODULE</th>
                                                    <th>PERMISSIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modules.map((mod, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <input type="checkbox" className="custom-checkbox" defaultChecked />
                                                        </td>
                                                        <td className="module-name-cell">
                                                            {mod.name}
                                                            {mod.subModules && <span className="text-xs text-gray-400 block font-normal">{mod.subModules.join(', ')}</span>}
                                                        </td>
                                                        <td>
                                                            <div className="permission-checkbox-group">
                                                                {mod.permissions.map((perm, pIdx) => (
                                                                    <label key={pIdx} className="perm-checkbox-item">
                                                                        <input type="checkbox" className="custom-checkbox" defaultChecked />
                                                                        <span>{perm}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Update Role</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Role</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body text-center py-8">
                            <div className="delete-icon-circle mx-auto mb-4">
                                <Trash2 size={32} color="#f43f5e" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Are you sure?</h3>
                            <p className="text-gray-500 mt-2">
                                You are about to delete the role <strong>{selectedRole?.name}</strong>.
                                This will affect all users assigned to this role.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#f43f5e' }}>Delete Role</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleList;
