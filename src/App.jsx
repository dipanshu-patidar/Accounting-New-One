import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* SuperAdmin Dashboard Routes */}
        <Route path="/superadmin/*" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<div className="p-6"><h1>SuperAdmin Dashboard</h1></div>} />
          {/* Add other sub-routes here later */}
        </Route>

        {/* Company Dashboard Routes */}
        <Route path="/company/*" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<div className="p-6"><h1>Company Admin Dashboard</h1></div>} />
          {/* Add other sub-routes here later */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;