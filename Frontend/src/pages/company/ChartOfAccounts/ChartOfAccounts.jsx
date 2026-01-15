import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Activity, Edit2, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import accountingService from '../../../services/accountingService';
import './ChartOfAccounts.css';

const ChartOfAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [groupedAccounts, setGroupedAccounts] = useState({
        ASSET: [],
        LIABILITY: [],
        EQUITY: [],
        INCOME: [],
        EXPENSE: []
    });
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accountType, setAccountType] = useState('');
    const [isSubAccount, setIsSubAccount] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        accountGroup: '',
        accountType: '',
        description: '',
        parentId: null,
        isEnabled: true,
        openingBalance: 0
    });

    // Fetch accounts on component mount
    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await accountingService.getAccounts();
            setAccounts(response.accounts || []);
            setGroupedAccounts(response.groupedAccounts || {
                ASSET: [],
                LIABILITY: [],
                EQUITY: [],
                INCOME: [],
                EXPENSE: []
            });
        } catch (error) {
            console.error('Error fetching accounts:', error);
            toast.error('Failed to fetch accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAccountTypeChange = (e) => {
        const value = e.target.value;
        setAccountType(value);

        // Map account type to account group
        const typeToGroupMap = {
            'current_asset': { group: 'ASSET', type: 'Current Asset' },
            'inventory_asset': { group: 'ASSET', type: 'Inventory Asset' },
            'non_current_asset': { group: 'ASSET', type: 'Non-current Asset' },
            'current_liability': { group: 'LIABILITY', type: 'Current Liability' },
            'long_term_liability': { group: 'LIABILITY', type: 'Long Term Liability' },
            'share_capital': { group: 'EQUITY', type: 'Share Capital' },
            'retained_earnings': { group: 'EQUITY', type: 'Retained Earnings' },
            'owners_equity': { group: 'EQUITY', type: 'Owners Equity' },
            'sales_revenue': { group: 'INCOME', type: 'Sales Revenue' },
            'other_revenue': { group: 'INCOME', type: 'Other Revenue' },
            'cogs': { group: 'EXPENSE', type: 'Costs of Goods Sold' },
            'payroll': { group: 'EXPENSE', type: 'Payroll Expenses' },
            'general': { group: 'EXPENSE', type: 'General and Administrative expenses' }
        };

        const mapping = typeToGroupMap[value] || { group: '', type: '' };
        setFormData(prev => ({
            ...prev,
            accountGroup: mapping.group,
            accountType: mapping.type
        }));
    };

    const getParentAccountOptions = () => {
        if (!formData.accountGroup) return [];
        return accounts.filter(acc => acc.accountGroup === formData.accountGroup);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            accountGroup: '',
            accountType: '',
            description: '',
            parentId: null,
            isEnabled: true,
            openingBalance: 0
        });
        setAccountType('');
        setIsSubAccount(false);
        setSelectedAccount(null);
    };

    const handleCreateAccount = async () => {
        try {
            if (!formData.name || !formData.code || !formData.accountGroup || !formData.accountType) {
                toast.error('Please fill in all required fields');
                return;
            }

            await accountingService.createAccount({
                ...formData,
                parentId: isSubAccount ? formData.parentId : null
            });

            toast.success('Account created successfully');
            setShowAddModal(false);
            resetForm();
            fetchAccounts();
        } catch (error) {
            console.error('Error creating account:', error);
            toast.error(error.response?.data?.error || 'Failed to create account');
        }
    };

    const handleEditClick = (account) => {
        setSelectedAccount(account);
        setFormData({
            name: account.name,
            code: account.code,
            accountGroup: account.accountGroup,
            accountType: account.accountType,
            description: account.description || '',
            parentId: account.parentId,
            isEnabled: account.isEnabled,
            openingBalance: account.openingBalance || 0
        });
        setIsSubAccount(!!account.parentId);
        setShowEditModal(true);
    };

    const handleUpdateAccount = async () => {
        try {
            if (!selectedAccount) return;

            await accountingService.updateAccount(selectedAccount.id, {
                name: formData.name,
                code: formData.code,
                accountType: formData.accountType,
                description: formData.description,
                parentId: isSubAccount ? formData.parentId : null,
                isEnabled: formData.isEnabled
            });

            toast.success('Account updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchAccounts();
        } catch (error) {
            console.error('Error updating account:', error);
            toast.error(error.response?.data?.error || 'Failed to update account');
        }
    };

    const handleDeleteClick = (account) => {
        setSelectedAccount(account);
        setShowDeleteModal(true);
    };

    const handleDeleteAccount = async () => {
        try {
            if (!selectedAccount) return;

            await accountingService.deleteAccount(selectedAccount.id);
            toast.success('Account deleted successfully');
            setShowDeleteModal(false);
            setSelectedAccount(null);
            fetchAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error(error.response?.data?.error || 'Failed to delete account');
        }
    };

    const formatBalance = (balance) => {
        if (balance === null || balance === undefined) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(balance);
    };

    const AccountTable = ({ title, data, groupKey }) => (
        <div className="Charts-of-Account-account-section-card">
            <div className="Charts-of-Account-section-header">
                <h3 className="Charts-of-Account-section-title">{title}</h3>
            </div>
            <div className="Charts-of-Account-table-responsive">
                <table className="Charts-of-Account-accounts-table">
                    <thead>
                        <tr>
                            <th>CODE</th>
                            <th>NAME</th>
                            <th>TYPE</th>
                            <th>PARENT ACCOUNT</th>
                            <th>BALANCE</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">No accounts found</td>
                            </tr>
                        ) : (
                            data.map((account) => (
                                <tr key={account.id}>
                                    <td>{account.code}</td>
                                    <td className="Charts-of-Account-text-green">{account.name}</td>
                                    <td>{account.accountType}</td>
                                    <td>{account.parent?.name || '-'}</td>
                                    <td>{formatBalance(account.currentBalance)}</td>
                                    <td>
                                        <span className={`Charts-of-Account-status-badge ${account.isEnabled ? 'Charts-of-Account-status-enabled' : 'Charts-of-Account-status-disabled'}`}>
                                            {account.isEnabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="Charts-of-Account-actions-cell">
                                            <button className="Charts-of-Account-action-btn-small Charts-of-Account-btn-warning" data-tooltip="Transaction Summary">
                                                <Activity size={16} />
                                            </button>
                                            <button
                                                className="Charts-of-Account-action-btn-small Charts-of-Account-btn-info"
                                                data-tooltip="Edit"
                                                onClick={() => handleEditClick(account)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            {!account.isSystemAccount && (
                                                <button
                                                    className="Charts-of-Account-action-btn-small Charts-of-Account-btn-danger"
                                                    data-tooltip="Delete"
                                                    onClick={() => handleDeleteClick(account)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="Charts-of-Account-chart-of-accounts-page">
                <div className="Charts-of-Account-loading">Loading accounts...</div>
            </div>
        );
    }

    return (
        <div className="Charts-of-Account-chart-of-accounts-page">
            {/* Page Header */}
            <div className="Charts-of-Account-page-header">
                <h1 className="Charts-of-Account-page-title">Chart of Accounts</h1>
                <button className="Charts-of-Account-btn-add" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add new account
                </button>
            </div>

            {/* Filter Section */}
            <div className="Charts-of-Account-filter-card">
                <div className="Charts-of-Account-filter-group">
                    <label className="Charts-of-Account-filter-label">Start Date</label>
                    <input type="date" className="Charts-of-Account-filter-input" placeholder="mm/dd/yyyy" />
                </div>
                <div className="Charts-of-Account-filter-group">
                    <label className="Charts-of-Account-filter-label">End Date</label>
                    <input type="date" className="Charts-of-Account-filter-input" placeholder="mm/dd/yyyy" />
                </div>
                <button className="Charts-of-Account-filter-btn Charts-of-Account-btn-search" data-tooltip="Search">
                    <Search size={20} />
                </button>
                <button
                    className="Charts-of-Account-filter-btn Charts-of-Account-btn-reset"
                    style={{ backgroundColor: '#ff5252' }}
                    data-tooltip="Refresh"
                    onClick={fetchAccounts}
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* 5 Tables */}
            <AccountTable title="Assets" data={groupedAccounts.ASSET} groupKey="ASSET" />
            <AccountTable title="Liabilities" data={groupedAccounts.LIABILITY} groupKey="LIABILITY" />
            <AccountTable title="Equity" data={groupedAccounts.EQUITY} groupKey="EQUITY" />
            <AccountTable title="Income" data={groupedAccounts.INCOME} groupKey="INCOME" />
            <AccountTable title="Expenses" data={groupedAccounts.EXPENSE} groupKey="EXPENSE" />

            {/* Create Account Modal */}
            {showAddModal && (
                <div className="Charts-of-Account-modal-overlay">
                    <div className="Charts-of-Account-modal-content">
                        <div className="Charts-of-Account-modal-header">
                            <h2 className="Charts-of-Account-modal-title">Create New Account</h2>
                            <button className="Charts-of-Account-close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>×</button>
                        </div>
                        <div className="Charts-of-Account-modal-body">
                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Name<span className="Charts-of-Account-text-red">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className="Charts-of-Account-form-input"
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="Charts-of-Account-form-row">
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Code<span className="Charts-of-Account-text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="code"
                                        className="Charts-of-Account-form-input"
                                        placeholder="Enter Code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Account Type<span className="Charts-of-Account-text-red">*</span></label>
                                    <select
                                        className="Charts-of-Account-form-select"
                                        value={accountType}
                                        onChange={handleAccountTypeChange}
                                    >
                                        <option value="">Select</option>
                                        <optgroup label="Assets">
                                            <option value="current_asset">Current Asset</option>
                                            <option value="inventory_asset">Inventory Asset</option>
                                            <option value="non_current_asset">Non-current Asset</option>
                                        </optgroup>
                                        <optgroup label="Liabilities">
                                            <option value="current_liability">Current Liabilities</option>
                                            <option value="long_term_liability">Long Term Liabilities</option>
                                            <option value="share_capital">Share Capital</option>
                                            <option value="retained_earnings">Retained Earnings</option>
                                        </optgroup>
                                        <optgroup label="Equity">
                                            <option value="owners_equity">Owners Equity</option>
                                        </optgroup>
                                        <optgroup label="Income">
                                            <option value="sales_revenue">Sales Revenue</option>
                                            <option value="other_revenue">Other Revenue</option>
                                        </optgroup>
                                        <optgroup label="Costs of Goods Sold">
                                            <option value="cogs">Costs of Goods Sold</option>
                                        </optgroup>
                                        <optgroup label="Expenses">
                                            <option value="payroll">Payroll Expenses</option>
                                            <option value="general">General and Administrative expenses</option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>

                            {/* Sub-account Checkbox and Parent Selection */}
                            <div className="Charts-of-Account-form-row" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width" style={{ marginBottom: 0 }}>
                                    <label className="Charts-of-Account-checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={isSubAccount}
                                            onChange={(e) => setIsSubAccount(e.target.checked)}
                                        />
                                        <span className="Charts-of-Account-checkmark"></span>
                                        Make this a sub-account
                                    </label>
                                </div>
                                {isSubAccount && (
                                    <div className="Charts-of-Account-form-group Charts-of-Account-half-width" style={{ marginBottom: 0 }}>
                                        <label className="Charts-of-Account-form-label">Parent Account</label>
                                        <select
                                            className="Charts-of-Account-form-select"
                                            name="parentId"
                                            value={formData.parentId || ''}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Parent Account</option>
                                            {getParentAccountOptions().map((acc) => (
                                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Opening Balance</label>
                                <input
                                    type="number"
                                    name="openingBalance"
                                    className="Charts-of-Account-form-input"
                                    placeholder="0.00"
                                    value={formData.openingBalance}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Is Enabled</label>
                                <label className="Charts-of-Account-switch">
                                    <input
                                        type="checkbox"
                                        name="isEnabled"
                                        checked={formData.isEnabled}
                                        onChange={handleInputChange}
                                    />
                                    <span className="Charts-of-Account-slider Charts-of-Account-round"></span>
                                </label>
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Description</label>
                                <textarea
                                    className="Charts-of-Account-form-textarea"
                                    name="description"
                                    placeholder="Enter Description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="Charts-of-Account-modal-footer">
                            <button className="Charts-of-Account-btn-cancel" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                            <button className="Charts-of-Account-btn-save" onClick={handleCreateAccount}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Account Modal */}
            {showEditModal && (
                <div className="Charts-of-Account-modal-overlay">
                    <div className="Charts-of-Account-modal-content">
                        <div className="Charts-of-Account-modal-header">
                            <h2 className="Charts-of-Account-modal-title">Edit Account</h2>
                            <button className="Charts-of-Account-close-btn" onClick={() => { setShowEditModal(false); resetForm(); }}>×</button>
                        </div>
                        <div className="Charts-of-Account-modal-body">
                            <div className="Charts-of-Account-form-row">
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Name<span className="Charts-of-Account-text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="Charts-of-Account-form-input"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Code<span className="Charts-of-Account-text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="code"
                                        className="Charts-of-Account-form-input"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Is Enabled</label>
                                <label className="Charts-of-Account-switch">
                                    <input
                                        type="checkbox"
                                        name="isEnabled"
                                        checked={formData.isEnabled}
                                        onChange={handleInputChange}
                                    />
                                    <span className="Charts-of-Account-slider Charts-of-Account-round"></span>
                                </label>
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Description</label>
                                <textarea
                                    className="Charts-of-Account-form-textarea"
                                    name="description"
                                    placeholder="Enter Description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="Charts-of-Account-modal-footer">
                            <button className="Charts-of-Account-btn-cancel" style={{ backgroundColor: '#6c757d', color: 'white' }} onClick={() => { setShowEditModal(false); resetForm(); }}>Cancel</button>
                            <button className="Charts-of-Account-btn-save" onClick={handleUpdateAccount}>Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="Charts-of-Account-modal-overlay">
                    <div className="Charts-of-Account-modal-content" style={{ maxWidth: '400px' }}>
                        <div className="Charts-of-Account-modal-header">
                            <h2 className="Charts-of-Account-modal-title">Delete Account</h2>
                            <button className="Charts-of-Account-close-btn" onClick={() => { setShowDeleteModal(false); setSelectedAccount(null); }}>×</button>
                        </div>
                        <div className="Charts-of-Account-modal-body">
                            <p>Are you sure you want to delete the account "{selectedAccount?.name}"?</p>
                            <p style={{ color: '#ff5252', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="Charts-of-Account-modal-footer">
                            <button className="Charts-of-Account-btn-cancel" onClick={() => { setShowDeleteModal(false); setSelectedAccount(null); }}>Cancel</button>
                            <button className="Charts-of-Account-btn-save" style={{ backgroundColor: '#ff5252' }} onClick={handleDeleteAccount}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartOfAccounts;
