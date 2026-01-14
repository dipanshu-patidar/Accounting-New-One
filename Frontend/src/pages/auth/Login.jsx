import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);
            toast.success('Login Successful!');

            const userData = response.user;
            console.log("Logged in user data:", userData);

            if (userData.role === 'SUPERADMIN') {
                navigate('/superadmin/dashboard');
            } else if (userData.role === 'ADMIN' || userData.role === 'COMPANY') {
                navigate('/company/dashboard');
            } else if (userData.role === 'USER') {
                navigate('/user/dashboard');
            } else {
                navigate('/company/dashboard');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">

                {/* LEFT SIDE – LOGIN */}
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="logo-text">
                            <span className="accent">Zirak</span> Books
                        </h1>
                        <p className="login-subtext">
                            Welcome back! Please sign in to continue.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="yours@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-footer">
                            <label className="remember">
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="login-btn">
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>

                {/* RIGHT SIDE – BRANDING */}
                <div className="brand-card">
                    <img
                        // src="https://zirak-book.netlify.app/assets/account-D0hzE4k5.jpg"
                        src="https://i.ibb.co/PvMV0BpB/image.png"
                        alt="Accounting"
                        className="brand-image"
                    />
                    <h2>Smart Accounting Solutions</h2>
                    <p>Track, manage, and grow your business with precision.</p>
                </div>

            </div>
        </div>
    );
};

export default Login;