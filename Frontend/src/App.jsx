import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import Company from './pages/superadmin/Company/Company';
import { Toaster } from 'react-hot-toast';
import './index.css';

import Plans from './pages/superadmin/Plans/Plans';
import PlanRequests from './pages/superadmin/PlanRequests/PlanRequests';
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
import CustomerDetail from './pages/company/Customers/CustomerDetail';

function App() {
  return (
    <AuthProvider>
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
            <Route path="plan-requests" element={<PlanRequests />} />
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
            <Route path="voucher/create" element={<CreateVoucher />} />
            <Route path="voucher/expenses" element={<Expense />} />
            <Route path="voucher/income" element={<Income />} />
            <Route path="voucher/contra" element={<ContraVoucher />} />
            <Route path="users/list" element={<UserList />} />
            <Route path="users/roles" element={<RoleList />} />
            {/* Add other sub-routes here later */}
          </Route>

          {/* User Dashboard Routes */}
          <Route path="/user/*" element={<SuperAdminLayout />}>
            <Route path="dashboard" element={<div>User Dashboard (Coming Soon)</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;