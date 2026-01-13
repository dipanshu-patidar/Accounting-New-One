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
import CustomerDetail from './pages/company/Customers/CustomerDetail';

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
          {/* Add other sub-routes here later */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;