import React, { useState, useRef } from 'react';
import {
    Building2, Mail, Phone, MapPin, Globe,
    Save, Upload, Image as ImageIcon,
    Landmark, FileText, StickyNote
} from 'lucide-react';
import './CompanySettings.css';

const CompanySettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Company Settings</h1>
                    <p className="page-subtitle">Manage your company profile and preferences</p>
                </div>
                <button className="btn-primary">
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="settings-container">
                {/* Tabs */}
                <div className="settings-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        General Info
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'address' ? 'active' : ''}`}
                        onClick={() => setActiveTab('address')}
                    >
                        Address
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'business' ? 'active' : ''}`}
                        onClick={() => setActiveTab('business')}
                    >
                        Business Settings
                    </button>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {activeTab === 'general' && (
                        <div className="form-section fade-in">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Company Name <span className="required">*</span></label>
                                    <div className="input-icon-wrapper">
                                        <Building2 size={18} className="input-icon" />
                                        <input type="text" defaultValue="Kiaan Solutions" placeholder="Enter company name" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Company Email <span className="required">*</span></label>
                                    <div className="input-icon-wrapper">
                                        <Mail size={18} className="input-icon" />
                                        <input type="email" defaultValue="info@kiaan.com" placeholder="Enter company email" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <div className="input-icon-wrapper">
                                        <Phone size={18} className="input-icon" />
                                        <input type="tel" defaultValue="+1 234 567 890" placeholder="Enter phone number" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Website</label>
                                    <div className="input-icon-wrapper">
                                        <Globe size={18} className="input-icon" />
                                        <input type="url" placeholder="https://www.example.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="logo-section">
                                <label>Company Logo</label>
                                <div className="logo-uploader">
                                    <div className="preview-box">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Company Logo" className="logo-preview-img" />
                                        ) : (
                                            <ImageIcon size={32} />
                                        )}
                                    </div>
                                    <div className="upload-controls">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleLogoChange}
                                            accept="image/jpeg, image/png, image/gif"
                                            style={{ display: 'none' }}
                                        />
                                        <button className="btn-upload" onClick={handleUploadClick}>
                                            <Upload size={16} /> Upload New Logo
                                        </button>
                                        <p className="upload-hint">Allowed JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'address' && (
                        <div className="form-section fade-in">
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Street Address</label>
                                    <div className="input-icon-wrapper">
                                        <MapPin size={18} className="input-icon" />
                                        <textarea rows="3" placeholder="123 Business St, Tech Park"></textarea>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" placeholder="New York" />
                                </div>
                                <div className="form-group">
                                    <label>State / Province</label>
                                    <input type="text" placeholder="NY" />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input type="text" placeholder="10001" />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <select>
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>India</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'business' && (
                        <div className="form-section fade-in">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Currency</label>
                                    <select defaultValue="USD">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="INR">INR (₹)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                            </div>

                            <h3 className="section-title">Bank Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Bank Name</label>
                                    <div className="input-icon-wrapper">
                                        <Landmark size={18} className="input-icon" />
                                        <input type="text" placeholder="e.g. Chase Bank" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Account Holder Name</label>
                                    <input type="text" placeholder="e.g. Kiaan Solutions LLC" />
                                </div>
                                <div className="form-group">
                                    <label>Account Number</label>
                                    <input type="text" placeholder="XXXXXXXXXXXX" />
                                </div>
                                <div className="form-group">
                                    <label>IFSC / Sort Code</label>
                                    <input type="text" placeholder="Code" />
                                </div>
                            </div>

                            <h3 className="section-title">Policies & Notes</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Terms & Conditions</label>
                                    <div className="input-icon-wrapper">
                                        <FileText size={18} className="input-icon" />
                                        <textarea rows="4" placeholder="Enter default terms and conditions for invoices..."></textarea>
                                    </div>
                                </div>
                                <div className="form-group full-width">
                                    <label>Default Notes</label>
                                    <div className="input-icon-wrapper">
                                        <StickyNote size={18} className="input-icon" />
                                        <textarea rows="3" placeholder="Enter default notes for customers..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;
