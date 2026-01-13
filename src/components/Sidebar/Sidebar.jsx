import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Building2, Ticket, CreditCard, Key,
    Users, ShoppingCart, Truck, FileText, ClipboardList,
    BarChart3, Settings, ChevronDown, ChevronRight, Box,
    Calculator, Receipt, UserCog
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, role = 'superadmin' }) => {
    const location = useLocation();
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    const menuItems = {
        superadmin: [
            { path: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/superadmin/company', label: 'Company', icon: Building2 },
            { path: '/superadmin/plan', label: 'Plans & Pricing', icon: Ticket },
            { path: '/superadmin/plan-requests', label: 'Request Plan', icon: ClipboardList },
            { path: '/superadmin/payments', label: 'Payments', icon: CreditCard },
            { path: '/superadmin/passwords', label: 'Manage Passwords', icon: Key },
        ],
        company: [
            { path: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            {
                label: 'Accounts',
                icon: Calculator,
                subItems: [
                    { path: '/company/accounts/charts', label: 'Charts of Accounts' },
                    { path: '/company/accounts/customers', label: 'Customers/Debtors' },
                    { path: '/company/accounts/vendors', label: 'Vendors/Creditors' },
                    { path: '/company/accounts/transactions', label: 'All Transaction' },
                ]
            },
            {
                label: 'Inventory',
                icon: Box,
                subItems: [
                    { path: '/company/inventory/warehouse', label: 'Warehouse' },
                    { path: '/company/inventory/uom', label: 'Unit of measure' },
                    { path: '/company/inventory/products', label: 'Product & Inventory' },
                    { path: '/company/inventory/services', label: 'Service' },
                    { path: '/company/inventory/transfer', label: 'StockTransfer' },
                    { path: '/company/inventory/adjustment', label: 'Inventory Adjustment' },
                ]
            },
            {
                label: 'Sales',
                icon: ShoppingCart,
                subItems: [
                    { path: '/company/sales/quotation', label: 'Quotation' },
                    { path: '/company/sales/order', label: 'Sales Order' },
                    { path: '/company/sales/challan', label: 'Delivery Challan' },
                    { path: '/company/sales/invoice', label: 'Invoice' },
                    { path: '/company/sales/payment', label: 'Payment' },
                    { path: '/company/sales/return', label: 'Sales Return' },
                ]
            },
            {
                label: 'Purchases',
                icon: Truck,
                subItems: [
                    { path: '/company/purchases/quotation', label: 'Purchase Quotation' },
                    { path: '/company/purchases/order', label: 'Purchase Order' },
                    { path: '/company/purchases/receipt', label: 'Goods Receipt' },
                    { path: '/company/purchases/bill', label: 'Bill' },
                    { path: '/company/purchases/payment', label: 'Payment' },
                    { path: '/company/purchases/return', label: 'Purchase Return' },
                ]
            },
            { path: '/company/pos', label: 'POS Screen', icon: ShoppingCart },
            {
                label: 'Voucher',
                icon: Receipt,
                subItems: [
                    { path: '/company/voucher/create', label: 'Create Voucher' },
                    { path: '/company/voucher/expenses', label: 'Expenses' },
                    { path: '/company/voucher/income', label: 'Income' },
                    { path: '/company/voucher/contra', label: 'Contra Voucher' },
                ]
            },
            {
                label: 'Reports',
                icon: BarChart3,
                subItems: [
                    { path: '/company/reports/sales', label: 'Sales Report' },
                    { path: '/company/reports/purchase', label: 'Purchase Report' },
                    { path: '/company/reports/pos', label: 'POS Report' },
                    { path: '/company/reports/tax', label: 'Tax Report' },
                    { path: '/company/reports/inventory', label: 'Inventory Summary' },
                    { path: '/company/reports/balance-sheet', label: 'Balance Sheet' },
                    { path: '/company/reports/cash-flow', label: 'Cash Flow' },
                    { path: '/company/reports/profit-loss', label: 'Profit & Loss' },
                    { path: '/company/reports/vat', label: 'Vat Report' },
                    { path: '/company/reports/daybook', label: 'DayBook' },
                    { path: '/company/reports/journal', label: 'Journal Entries' },
                    { path: '/company/reports/ledger', label: 'Ledger' },
                    { path: '/company/reports/trial-balance', label: 'Trial Balance' },
                ]
            },
            {
                label: 'User Management',
                icon: Users,
                subItems: [
                    { path: '/company/users/roles', label: 'Roles & Permissions' },
                    { path: '/company/users/list', label: 'Users' },
                ]
            },
            {
                label: 'Settings',
                icon: Settings,
                subItems: [
                    { path: '/company/settings/info', label: 'Company Info' },
                    { path: '/company/settings/password-requests', label: 'Password Requests' },
                ]
            }
        ]
    };

    const renderMenu = (items) => {
        return items.map((item, index) => {
            if (item.subItems) {
                const isExpanded = expandedGroups[item.label];
                const isActive = item.subItems.some(sub => location.pathname.startsWith(sub.path));

                return (
                    <div key={index} className="menu-group">
                        <div
                            className={`menu-item has-submenu ${isActive ? 'active-parent' : ''}`}
                            onClick={() => toggleGroup(item.label)}
                        >
                            <div className="icon-label">
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </div>
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                        {isExpanded && (
                            <div className="submenu">
                                {item.subItems.map((sub, subIndex) => (
                                    <NavLink
                                        key={subIndex}
                                        to={sub.path}
                                        className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                                    >
                                        {sub.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <div className="icon-label">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </div>
                </NavLink>
            );
        });
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-main">ACCOUNT</span><span className="logo-accent">GO</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                {renderMenu(menuItems[role] || [])}
            </nav>
        </aside>
    );
};

export default Sidebar;
