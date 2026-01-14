import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import './SuperAdminLayout.css';

const SuperAdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { currentUser } = useContext(AuthContext);
    // Wait, dynamic import in useContext is bad. I need to add the import at top.

    const location = useLocation();

    // Mapping backend roles to Sidebar keys
    // Backend: SUPERADMIN, ADMIN, USER
    // Sidebar: superadmin, company, user
    let userRole = 'company'; // Default

    if (currentUser?.role === 'SUPERADMIN') {
        userRole = 'superadmin';
    } else if (currentUser?.role === 'ADMIN' || currentUser?.role === 'COMPANY') {
        userRole = 'company';
    } else if (currentUser?.role === 'USER') {
        userRole = 'user';
    } else {
        // Fallback for current URL if currentUser is not yet loaded (e.g. refresh)
        if (location.pathname.startsWith('/superadmin')) userRole = 'superadmin';
        if (location.pathname.startsWith('/company')) userRole = 'company';
        if (location.pathname.startsWith('/user')) userRole = 'user';
    }

    return (
        <div className="layout-container">
            <Sidebar isOpen={isSidebarOpen} role={userRole} />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
