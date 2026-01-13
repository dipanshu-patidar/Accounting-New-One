import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import './SuperAdminLayout.css';

const SuperAdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Determine role based on URL path (simple and effective for this stage)
    const location = useLocation();
    const isCompany = location.pathname.startsWith('/company');
    const userRole = isCompany ? 'company' : 'superadmin';

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
