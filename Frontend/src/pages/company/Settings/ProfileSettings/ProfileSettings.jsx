import React, { useState, useRef } from 'react';
import { Upload, User, Save, Lock } from 'lucide-react';
import './ProfileSettings.css';

const ProfileSettings = () => {
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
        <div className="profile-settings-page">
            {/* Personal Info Section */}
            <div className="profile-card">
                <div className="card-header-line">
                    <h2 className="card-title">Personal Info</h2>
                </div>

                <div className="form-content">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Name<span className="required">*</span></label>
                            <input type="text" defaultValue="WorkDo" placeholder="Enter Name" />
                        </div>
                        <div className="form-group half">
                            <label>Email<span className="required">*</span></label>
                            <input type="email" defaultValue="company@example.com" placeholder="Enter Email" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Avatar</label>
                        <div className="avatar-upload-container">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleLogoChange}
                                style={{ display: 'none' }}
                            />
                            <button className="btn-choose-file" onClick={handleUploadClick}>
                                <Upload size={16} /> Choose file here
                            </button>

                            <div className="avatar-preview">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Avatar" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>
                            <p className="upload-help">Please upload a valid image file. Size of image should not be more than 2MB.</p>
                        </div>
                    </div>

                    <div className="form-actions right">
                        <button className="btn-save green">Save Changes</button>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="profile-card">
                <div className="card-header-line">
                    <h2 className="card-title">Change Password</h2>
                </div>

                <div className="form-content">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Old Password<span className="required">*</span></label>
                            <input type="password" placeholder="Enter Old Password" />
                        </div>
                        <div className="form-group half">
                            <label>New Password<span className="required">*</span></label>
                            <input type="password" placeholder="Enter Your Password" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Confirm New Password<span className="required">*</span></label>
                            <input type="password" placeholder="Confirm New Password" />
                        </div>
                    </div>

                    <div className="form-actions right">
                        <button className="btn-save green">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
