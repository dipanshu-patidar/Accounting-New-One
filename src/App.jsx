import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import Company from './pages/superadmin/Company/Company';
import { Toaster } from 'react-hot-toast';
import './index.css';

import Plans from './pages/superadmin/Plans/Plans';
import RequestPlan from './pages/superadmin/RequestPlan/RequestPlan';
import Payments from './pages/superadmin/Payments/Payments';
import ManagePasswords from './pages/superadmin/ManagePasswords/ManagePasswords';
import CompanyDashboard from './pages/company/Dashboard/CompanyDashboard';
import ChartOfAccounts from './pages/company/ChartOfAccounts/ChartOfAccounts';
import Customers from './pages/company/Customers/Customers';
import Vendors from './pages/company/Vendors/Vendors';
import VendorDetail from './pages/company/Vendors/VendorDetail';
import Transactions from './pages/company/Accounts/Transactions/Transactions';
import Warehouse from './pages/company/Inventory/Warehouse';
import UOM from './pages/company/Inventory/UOM/UOM';
import Inventory from './pages/company/Inventory/ProductInventory/Inventory';
import Services from './pages/company/Inventory/Services/Services';
import StockTransfer from './pages/company/Inventory/StockTransfer/StockTransfer';
import InventoryAdjustment from './pages/company/Inventory/InventoryAdjustment/InventoryAdjustment';
import CreateVoucher from './pages/company/Voucher/CreateVoucher';
import Expense from './pages/company/Accounts/Expense/Expense';
import Income from './pages/company/Accounts/Income/Income';
import ContraVoucher from './pages/company/Accounts/ContraVoucher/ContraVoucher';
import UserList from './pages/company/Users/UserList';
import RoleList from './pages/company/Users/RoleList';
import Quotation from './pages/company/Sales/Quotation/Quotation';
import SalesOrder from './pages/company/Sales/SalesOrder/SalesOrder';
import DeliveryChallan from './pages/company/Sales/DeliveryChallan/DeliveryChallan';
import Invoice from './pages/company/Sales/Invoice/Invoice';
import Payment from './pages/company/Sales/Payment/Payment';
import SalesReturn from './pages/company/Sales/SalesReturn/SalesReturn';
import CustomerDetail from './pages/company/Customers/CustomerDetail';
import SalesReport from './pages/company/Reports/SalesReport/SalesReport';
import PurchaseReport from './pages/company/Reports/PurchaseReport/PurchaseReport';
import POSReport from './pages/company/Reports/POSReport/POSReport';
import TaxReport from './pages/company/Reports/TaxReport/TaxReport';
import InventorySummary from './pages/company/Reports/InventorySummary/InventorySummary';
import CashFlow from './pages/company/Reports/CashFlow/CashFlow';
import ProfitLoss from './pages/company/Reports/ProfitLoss/ProfitLoss';
import BalanceSheet from './pages/company/Reports/BalanceSheet/BalanceSheet';
import VatReport from './pages/company/Reports/VatReport/VatReport';
import DayBook from './pages/company/Reports/DayBook/DayBook';
import JournalEntries from './pages/company/Reports/JournalEntries/JournalEntries';
import LedgerReport from './pages/company/Reports/LedgerReport/LedgerReport';
import TrialBalance from './pages/company/Reports/TrialBalance/TrialBalance';
import CompanySettings from './pages/company/Settings/CompanySettings/CompanySettings';
import PasswordRequests from './pages/company/Settings/PasswordRequests/PasswordRequests';
import ProfileSettings from './pages/company/Settings/ProfileSettings/ProfileSettings';
import BankTransfer from './pages/company/Banking/BankTransfer/BankTransfer';

function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                {/* SuperAdmin Dashboard Routes */}
                <Route path="/superadmin/*" element={<SuperAdminLayout />}>
                    <Route path="dashboard" element={<SuperAdminDashboard />} />
                    <Route path="company" element={<Company />} />
                    <Route path="plan" element={<Plans />} />
                    <Route path="plan-requests" element={<RequestPlan />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="passwords" element={<ManagePasswords />} />
                    {/* Add other sub-routes here later */}
                </Route>

                {/* Company Dashboard Routes */}
                <Route path="/company/*" element={<SuperAdminLayout />}>
                    <Route path="dashboard" element={<CompanyDashboard />} />
                    <Route path="accounts/charts" element={<ChartOfAccounts />} />
                    <Route path="accounts/customers" element={<Customers />} />
                    <Route path="accounts/customers/:id" element={<CustomerDetail />} />
                    <Route path="accounts/vendors" element={<Vendors />} />
                    <Route path="accounts/vendors/:id" element={<VendorDetail />} />
                    <Route path="accounts/transactions" element={<Transactions />} />
                    <Route path="inventory/warehouse" element={<Warehouse />} />
                    <Route path="inventory/uom" element={<UOM />} />
                    <Route path="inventory/products" element={<Inventory />} />
                    <Route path="inventory/services" element={<Services />} />
                    <Route path="inventory/transfer" element={<StockTransfer />} />
                    <Route path="inventory/adjustment" element={<InventoryAdjustment />} />
                    <Route path="sales/quotation" element={<Quotation />} />
                    <Route path="sales/order" element={<SalesOrder />} />
                    <Route path="sales/challan" element={<DeliveryChallan />} />
                    <Route path="sales/invoice" element={<Invoice />} />
                    <Route path="sales/payment" element={<Payment />} />
                    <Route path="sales/return" element={<SalesReturn />} />
                    <Route path="voucher/create" element={<CreateVoucher />} />
                    <Route path="voucher/expenses" element={<Expense />} />
                    <Route path="voucher/income" element={<Income />} />
                    <Route path="voucher/contra" element={<ContraVoucher />} />
                    <Route path="users/list" element={<UserList />} />
                    <Route path="users/roles" element={<RoleList />} />
                    <Route path="reports/sales" element={<SalesReport />} />
                    <Route path="reports/purchase" element={<PurchaseReport />} />
                    <Route path="reports/pos" element={<POSReport />} />
                    <Route path="reports/tax" element={<TaxReport />} />
                    <Route path="reports/inventory-summary" element={<InventorySummary />} />
                    <Route path="reports/cash-flow" element={<CashFlow />} />
                    <Route path="reports/profit-loss" element={<ProfitLoss />} />
                    <Route path="reports/balance-sheet" element={<BalanceSheet />} />
                    <Route path="reports/vat" element={<VatReport />} />
                    <Route path="reports/daybook" element={<DayBook />} />
                    <Route path="reports/journal" element={<JournalEntries />} />
                    <Route path="reports/ledger" element={<LedgerReport />} />
                    <Route path="reports/trial-balance" element={<TrialBalance />} />
                    <Route path="settings/info" element={<CompanySettings />} />
                    <Route path="settings/password-requests" element={<PasswordRequests />} />
                    <Route path="settings/profile" element={<ProfileSettings />} />
                    <Route path="bank-transfer" element={<BankTransfer />} />
                    {/* Add other sub-routes here later */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
