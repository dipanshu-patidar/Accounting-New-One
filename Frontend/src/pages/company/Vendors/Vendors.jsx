import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, RotateCcw } from 'lucide-react';
import './Vendors.css';

const Vendors = () => {
    const navigate = useNavigate();
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);

    // Mock data based on the requested fields and image
    const [vendors] = useState([
        {
            id: 1,
            voucherNo: 'VEND00001',
            nameEnglish: 'Anthony B Renfroe',
            nameArabic: 'أنطوني ب رينفرو',
            contact: '+85967412345',
            email: 'anthony@dayrep.com',
            accountType: 'Creditors',
            accountName: 'Anthony Account',
            openingBalance: '8,454.08',
            lastLogin: '2026-01-13 10:15:14'
        },
        {
            id: 2,
            voucherNo: 'VEND00002',
            nameEnglish: 'Kim J Gibson',
            nameArabic: 'كيم ج جيبسون',
            contact: '+7896541235',
            email: '5a6oxm34en8@powerencry.com',
            accountType: 'Creditors',
            accountName: 'Kim Account',
            openingBalance: '-957.80',
            lastLogin: '-'
        }
    ]);

    const [enableGst, setEnableGst] = useState(true);
    const [billingData, setBillingData] = useState({
        name: '', phone: '', address: '', city: '', state: '', country: '', zip: ''
    });
    const [shippingData, setShippingData] = useState({
        name: '', phone: '', address: ''
    });

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingData(prev => ({ ...prev, [name]: value }));
    };

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSameAsBilling = () => {
        setShippingData({
            name: billingData.name,
            phone: billingData.phone,
            address: billingData.address
        });
    };

    const handleEdit = (vendor) => {
        setSelectedVendor(vendor);
        setShowEditModal(true);
    };

    const handleDelete = (vendor) => {
        setSelectedVendor(vendor);
        setShowDeleteModal(true);
    };

    return (
        <div className="customers-page">
            <div className="page-header">
                <h1 className="page-title">Vendors</h1>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add New Vendor
                </button>
            </div>

            <div className="customers-card">
                <div className="controls-row">
                    <div className="entries-control">
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            className="entries-select"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="entries-text">entries per page</span>
                    </div>
                    <div className="search-control">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>VOUCHER NO</th>
                                <th>NAME (ENGLISH)</th>
                                <th>NAME (ARABIC)</th>
                                <th>CONTACT</th>
                                <th>EMAIL</th>
                                <th>ACCOUNT TYPE</th>
                                <th>ACCOUNT NAME</th>
                                <th>OPENING BALANCE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor, index) => (
                                <tr key={vendor.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="voucher-badge" style={{ cursor: 'pointer' }} onClick={() => navigate(`/company/accounts/vendors/${vendor.id}`)}>
                                            #{vendor.voucherNo}
                                        </div>
                                    </td>
                                    <td>{vendor.nameEnglish}</td>
                                    <td>{vendor.nameArabic}</td>
                                    <td>{vendor.contact}</td>
                                    <td>{vendor.email}</td>
                                    <td>{vendor.accountType}</td>
                                    <td>{vendor.accountName}</td>
                                    <td className={vendor.openingBalance.startsWith('-') ? 'text-danger' : 'text-success'}>
                                        ${vendor.openingBalance}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" data-tooltip="View" onClick={() => navigate(`/company/accounts/vendors/${vendor.id}`)}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(vendor)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(vendor)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {vendors.length} of {vendors.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content modal-large">
                        <div className="modal-header">
                            <h2 className="modal-title">Add Vendor</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label className="form-label">Name (English) <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" placeholder="Enter Name (English)" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name (Arabic)</label>
                                    <input type="text" className="form-input" placeholder="Enter Name (Arabic)" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input type="text" className="form-input" placeholder="Enter company name" />
                                </div>
                            </div>

                            <div className="form-row mixed-col">
                                <div className="form-group google-loc">
                                    <label className="form-label">Company Google Location</label>
                                    <input type="text" className="form-input" placeholder="Enter Google Maps link" />
                                </div>
                                <div className="form-group profile-img">
                                    <label className="form-label">Profile Image</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" id="profileImg" className="file-input" />
                                        <label htmlFor="profileImg" className="file-label">
                                            <span className="file-btn">Choose File</span>
                                            <span className="file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="file-note">JPEG, PNG or JPG (max 5MB)</small>
                                </div>
                                <div className="form-group any-file">
                                    <label className="form-label">Any File</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" id="anyFile" className="file-input" />
                                        <label htmlFor="anyFile" className="file-label">
                                            <span className="file-btn">Choose File</span>
                                            <span className="file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="file-note">Any file type. If image, max 5MB</small>
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Account Type <span className="text-red">*</span></label>
                                    <select className="form-select">
                                        <option value="">-- Select Account --</option>
                                        <option value="creditors">Creditors</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Balance Type</label>
                                    <select className="form-select">
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Account Name <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" placeholder="This will auto-fill from selection above" readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Account Balance <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" defaultValue="0.00" />
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Creation Date <span className="text-red">*</span></label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bank Account Number</label>
                                    <input type="text" className="form-input" placeholder="Enter bank account number" />
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Bank IFSC</label>
                                    <input type="text" className="form-input" placeholder="Enter bank IFSC" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bank Name & Branch</label>
                                    <input type="text" className="form-input" placeholder="Enter bank name & branch" />
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Phone <span className="text-red">*</span></label>
                                    <div className="input-with-note">
                                        <input type="text" className="form-input" placeholder="Enter Phone" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email <span className="text-red">*</span></label>
                                    <input type="email" className="form-input" placeholder="Enter Email" />
                                </div>
                            </div>

                            <div className="form-row two-col" style={{ alignItems: 'flex-start' }}>
                                <div className="form-group">
                                    <label className="form-label">Credit Period (days)</label>
                                    <input type="text" className="form-input" placeholder="Enter credit period" />
                                </div>
                                <div className="form-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ marginBottom: 0 }}>GSTIN <span className="text-red">*</span></label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Enable GST</span>
                                            <label className="switch">
                                                <input type="checkbox" checked={enableGst} onChange={(e) => setEnableGst(e.target.checked)} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <input type="text" className="form-input" placeholder="Enter GSTIN" disabled={!enableGst} />
                                </div>
                            </div>

                            {/* Billing Address Section */}
                            <div className="form-section">
                                <h3 className="section-subtitle">Billing Address</h3>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Name"
                                            name="name" value={billingData.name} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <div className="input-with-note">
                                            <input
                                                type="text" className="form-input" placeholder="Enter Phone"
                                                name="phone" value={billingData.phone} onChange={handleBillingChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={billingData.address} onChange={handleBillingChange}
                                    ></textarea>
                                </div>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter City"
                                            name="city" value={billingData.city} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter State"
                                            name="state" value={billingData.state} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Country"
                                            name="country" value={billingData.country} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Zip Code</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Zip Code"
                                            name="zip" value={billingData.zip} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address Section */}
                            <div className="form-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 className="section-subtitle" style={{ marginBottom: 0 }}>Shipping Address</h3>
                                    <button className="btn-action-small" onClick={handleSameAsBilling}>Shipping Same As Billing</button>
                                </div>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Name"
                                            name="name" value={shippingData.name} onChange={handleShippingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <div className="input-with-note">
                                            <input
                                                type="text" className="form-input" placeholder="Enter Phone"
                                                name="phone" value={shippingData.phone} onChange={handleShippingChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={shippingData.address} onChange={handleShippingChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-save" style={{ backgroundColor: '#8ce043' }}>Save Vendor</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content modal-large">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Vendor</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label className="form-label">Name (English) <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" defaultValue={selectedVendor?.nameEnglish} placeholder="Enter Name (English)" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name (Arabic)</label>
                                    <input type="text" className="form-input" defaultValue={selectedVendor?.nameArabic} placeholder="Enter Name (Arabic)" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input type="text" className="form-input" placeholder="Enter company name" />
                                </div>
                            </div>

                            <div className="form-row mixed-col">
                                <div className="form-group google-loc">
                                    <label className="form-label">Company Google Location</label>
                                    <input type="text" className="form-input" placeholder="Enter Google Maps link" />
                                </div>
                                <div className="form-group profile-img">
                                    <label className="form-label">Profile Image</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" id="editProfileImg" className="file-input" />
                                        <label htmlFor="editProfileImg" className="file-label">
                                            <span className="file-btn">Choose File</span>
                                            <span className="file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="file-note">JPEG, PNG or JPG (max 5MB)</small>
                                </div>
                                <div className="form-group any-file">
                                    <label className="form-label">Any File</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" id="editAnyFile" className="file-input" />
                                        <label htmlFor="editAnyFile" className="file-label">
                                            <span className="file-btn">Choose File</span>
                                            <span className="file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="file-note">Any file type. If image, max 5MB</small>
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Account Type <span className="text-red">*</span></label>
                                    <select className="form-select" defaultValue={selectedVendor?.accountType.toLowerCase()}>
                                        <option value="">-- Select Account --</option>
                                        <option value="creditors">Creditors</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Balance Type</label>
                                    <select className="form-select" defaultValue="credit">
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Account Name <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" defaultValue={selectedVendor?.accountName} placeholder="This will auto-fill from selection above" readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Account Balance <span className="text-red">*</span></label>
                                    <input type="text" className="form-input" defaultValue={selectedVendor?.openingBalance} />
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Creation Date <span className="text-red">*</span></label>
                                    <input type="date" className="form-input" defaultValue="2026-01-13" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bank Account Number</label>
                                    <input type="text" className="form-input" placeholder="Enter bank account number" />
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Bank IFSC</label>
                                    <input type="text" className="form-input" placeholder="Enter bank IFSC" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bank Name & Branch</label>
                                    <input type="text" className="form-input" placeholder="Enter bank name & branch" />
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Phone <span className="text-red">*</span></label>
                                    <div className="input-with-note">
                                        <input type="text" className="form-input" defaultValue={selectedVendor?.contact} placeholder="Enter Phone" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email <span className="text-red">*</span></label>
                                    <input type="email" className="form-input" defaultValue={selectedVendor?.email} placeholder="Enter Email" />
                                </div>
                            </div>

                            <div className="form-row two-col" style={{ alignItems: 'flex-start' }}>
                                <div className="form-group">
                                    <label className="form-label">Credit Period (days)</label>
                                    <input type="text" className="form-input" placeholder="Enter credit period" />
                                </div>
                                <div className="form-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ marginBottom: 0 }}>GSTIN <span className="text-red">*</span></label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Enable GST</span>
                                            <label className="switch">
                                                <input type="checkbox" checked={enableGst} onChange={(e) => setEnableGst(e.target.checked)} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <input type="text" className="form-input" placeholder="Enter GSTIN" disabled={!enableGst} />
                                </div>
                            </div>

                            {/* Billing Address Section */}
                            <div className="form-section">
                                <h3 className="section-subtitle">Billing Address</h3>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Name"
                                            name="name" value={billingData.name} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <div className="input-with-note">
                                            <input
                                                type="text" className="form-input" placeholder="Enter Phone"
                                                name="phone" value={billingData.phone} onChange={handleBillingChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={billingData.address} onChange={handleBillingChange}
                                    ></textarea>
                                </div>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter City"
                                            name="city" value={billingData.city} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter State"
                                            name="state" value={billingData.state} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Country"
                                            name="country" value={billingData.country} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Zip Code</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Zip Code"
                                            name="zip" value={billingData.zip} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address Section */}
                            <div className="form-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 className="section-subtitle" style={{ marginBottom: 0 }}>Shipping Address</h3>
                                    <button className="btn-action-small" onClick={handleSameAsBilling}>Shipping Same As Billing</button>
                                </div>
                                <div className="form-row two-col">
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text" className="form-input" placeholder="Enter Name"
                                            name="name" value={shippingData.name} onChange={handleShippingChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <div className="input-with-note">
                                            <input
                                                type="text" className="form-input" placeholder="Enter Phone"
                                                name="phone" value={shippingData.phone} onChange={handleShippingChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={shippingData.address} onChange={handleShippingChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-save" style={{ backgroundColor: '#8ce043' }}>Update Vendor</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Vendor</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete vendor <strong>{selectedVendor?.nameEnglish}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-save btn-danger-action" style={{ backgroundColor: '#ff5252' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendors;
