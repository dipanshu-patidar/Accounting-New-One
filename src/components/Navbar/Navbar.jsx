import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Globe, Bell, Plus, ChevronDown, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button onClick={toggleSidebar} className="icon-btn toggle-btn">
                    <Menu size={20} />
                </button>
                <span className="navbar-title">Dashboard</span>
            </div>

            <div className="navbar-right">
                {/* Quick Add Button */}
                {/* <button className="icon-btn-outlined">
                    <Plus size={18} />
                </button> */}

                {/* <div className="divider"></div> */}

                <button className="icon-btn">
                    <Globe size={18} />
                    <span className="lang-text">English</span>
                    <ChevronDown size={14} />
                </button>

                {/* <button className="icon-btn notification-btn">
                    <Bell size={18} />
                    <span className="badge"></span>
                </button> */}

                <div className="user-profile-container">
                    <div
                        className="user-profile"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="User"
                            className="avatar"
                        />
                        <div className="user-info">
                            <span className="user-name">Hi, WorkDo!</span>
                            <ChevronDown size={14} className="text-muted" />
                        </div>
                    </div>

                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    navigate('/company/settings/profile');
                                }}
                            >
                                <User size={16} />
                                <span>My Profile</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-item text-danger" onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
