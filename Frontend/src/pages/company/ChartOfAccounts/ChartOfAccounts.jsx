import React from 'react';
import { Search, RotateCcw, Activity, Edit2, Trash2, Plus } from 'lucide-react';
import './ChartOfAccounts.css';

const ChartOfAccounts = () => {
    // Mock Data mimicking the image
    const assetAccounts = [
        { code: '1060', name: 'Checking Account', type: 'Current Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1065', name: 'Petty Cash', type: 'Current Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1200', name: 'Account Receivables', type: 'Current Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1205', name: 'Allowance for doubtful accounts', type: 'Current Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1510', name: 'Inventory', type: 'Inventory Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1520', name: 'Stock of Raw Materials', type: 'Inventory Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1530', name: 'Stock of Work In Progress', type: 'Inventory Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1540', name: 'Stock of Finished Goods', type: 'Inventory Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
        { code: '1550', name: 'Goods Received Clearing account', type: 'Inventory Asset', parent: 'Opening Balances and adjustments', balance: '-', status: 'Enabled' },
    ];

    // Placeholder data for other sections to demonstrate structure
    const liabilityAccounts = [
        { code: '2100', name: 'Accounts Payable', type: 'Current Liability', parent: '-', balance: '-', status: 'Enabled' },
        { code: '2150', name: 'Tax Payable', type: 'Current Liability', parent: '-', balance: '-', status: 'Enabled' },
    ];

    const equityAccounts = [
        { code: '3000', name: 'Owner\'s Equity', type: 'Equity', parent: '-', balance: '-', status: 'Enabled' },
    ];

    const incomeAccounts = [
        { code: '4000', name: 'Sales Revenue', type: 'Income', parent: '-', balance: '-', status: 'Enabled' },
    ];

    const expenseAccounts = [
        { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', parent: '-', balance: '-', status: 'Enabled' },
    ];

    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [accountType, setAccountType] = React.useState('');
    const [isSubAccount, setIsSubAccount] = React.useState(false);

    // Consolidated data for lookup
    const allAccounts = [
        ...assetAccounts,
        ...liabilityAccounts,
        ...equityAccounts,
        ...incomeAccounts,
        ...expenseAccounts
    ];

    const getParentAccountOptions = () => {
        const typeMap = {
            'current_asset': 'Current Asset',
            'inventory_asset': 'Inventory Asset',
            'current_liability': 'Current Liability',
            'owners_equity': 'Equity',
            'sales_revenue': 'Income',
            'cogs': 'Expense',
            // Add loose mapping or default to exact string match if needed
        };
        const targetType = typeMap[accountType] || '';
        return allAccounts.filter(acc => acc.type === targetType);
    };

    const AccountTable = ({ title, data }) => (
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
                            <th>PARENT ACCOUNT NAME</th>
                            <th>BALANCE</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((account, index) => (
                            <tr key={index}>
                                <td>{account.code}</td>
                                <td className="Charts-of-Account-text-green">{account.name}</td>
                                <td>{account.type}</td>
                                <td>{account.parent}</td>
                                <td>{account.balance}</td>
                                <td>
                                    <span className="Charts-of-Account-status-badge Charts-of-Account-status-enabled">{account.status}</span>
                                </td>
                                <td>
                                    <div className="Charts-of-Account-actions-cell">
                                        <button className="Charts-of-Account-action-btn-small Charts-of-Account-btn-warning" data-tooltip="Transaction Summary">
                                            <Activity size={16} />
                                        </button>
                                        <button className="Charts-of-Account-action-btn-small Charts-of-Account-btn-info" data-tooltip="Edit" onClick={() => setShowEditModal(true)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="Charts-of-Account-action-btn-small Charts-of-Account-btn-danger" data-tooltip="Delete" onClick={() => setShowDeleteModal(true)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="Charts-of-Account-chart-of-accounts-page">
            {/* Page Header */}
            <div className="Charts-of-Account-page-header">
                <h1 className="Charts-of-Account-page-title">Charts of Account</h1>
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
                <button className="Charts-of-Account-filter-btn Charts-of-Account-btn-reset" style={{ backgroundColor: '#ff5252' }} data-tooltip="Reset">
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* 5 Tables */}
            <AccountTable title="Assets" data={assetAccounts} />
            <AccountTable title="Liabilities" data={liabilityAccounts} />
            <AccountTable title="Equity" data={equityAccounts} />
            <AccountTable title="Income" data={incomeAccounts} />
            <AccountTable title="Expenses" data={expenseAccounts} />

            {/* Create Account Modal */}
            {showAddModal && (
                <div className="Charts-of-Account-modal-overlay">
                    <div className="Charts-of-Account-modal-content">
                        <div className="Charts-of-Account-modal-header">
                            <h2 className="Charts-of-Account-modal-title">Create New Account</h2>
                            <button className="Charts-of-Account-close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="Charts-of-Account-modal-body">
                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Name<span className="Charts-of-Account-text-red">*</span></label>
                                <input type="text" className="Charts-of-Account-form-input" placeholder="Enter Name" />
                            </div>

                            <div className="Charts-of-Account-form-row">
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Code<span className="Charts-of-Account-text-red">*</span></label>
                                    <input type="text" className="Charts-of-Account-form-input" placeholder="Enter Code" />
                                </div>
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Account Type<span className="Charts-of-Account-text-red">*</span></label>
                                    <select
                                        className="Charts-of-Account-form-select"
                                        value={accountType}
                                        onChange={(e) => setAccountType(e.target.value)}
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
                                        <select className="Charts-of-Account-form-select">
                                            <option value="">Select Parent Account</option>
                                            {getParentAccountOptions().map((acc, i) => (
                                                <option key={i} value={acc.code}>{acc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Is Enabled</label>
                                <label className="Charts-of-Account-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="Charts-of-Account-slider Charts-of-Account-round"></span>
                                </label>
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Description</label>
                                <textarea className="Charts-of-Account-form-textarea" placeholder="Enter Description" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="Charts-of-Account-modal-footer">
                            <button className="Charts-of-Account-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="Charts-of-Account-btn-save">Create</button>
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
                            <button className="Charts-of-Account-close-btn" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="Charts-of-Account-modal-body">
                            <div className="Charts-of-Account-form-row">
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Name<span className="Charts-of-Account-text-red">*</span></label>
                                    {/* Pre-filled mock data */}
                                    <input type="text" className="Charts-of-Account-form-input" defaultValue="Checking Account" />
                                </div>
                                <div className="Charts-of-Account-form-group Charts-of-Account-half-width">
                                    <label className="Charts-of-Account-form-label">Code<span className="Charts-of-Account-text-red">*</span></label>
                                    <input type="text" className="Charts-of-Account-form-input" defaultValue="1060" />
                                </div>
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Is Enabled</label>
                                <label className="Charts-of-Account-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="Charts-of-Account-slider Charts-of-Account-round"></span>
                                </label>
                            </div>

                            <div className="Charts-of-Account-form-group">
                                <label className="Charts-of-Account-form-label">Description</label>
                                <textarea className="Charts-of-Account-form-textarea" placeholder="Enter Description" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="Charts-of-Account-modal-footer">
                            <button className="Charts-of-Account-btn-cancel" style={{ backgroundColor: '#6c757d', color: 'white' }} onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="Charts-of-Account-btn-save">Update</button>
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
                            <button className="Charts-of-Account-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="Charts-of-Account-modal-body">
                            <p>Are you sure you want to delete this account?</p>
                        </div>
                        <div className="Charts-of-Account-modal-footer">
                            <button className="Charts-of-Account-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="Charts-of-Account-btn-save" style={{ backgroundColor: '#ff5252' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartOfAccounts;
