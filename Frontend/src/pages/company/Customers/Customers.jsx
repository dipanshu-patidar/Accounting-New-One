import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, RotateCcw } from 'lucide-react';
import './Customers.css';

const Customers = () => {
    const navigate = useNavigate();
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Mock data based on the requested fields and image
    const [customers] = useState([
        {
            id: 1,
            voucherNo: 'CUST00001',
            nameEnglish: 'Keir',
            nameArabic: 'كير',
            contact: '+8596741234',
            email: 'IsidroTJohnson@armyspy.com',
            accountType: 'Debtors',
            accountName: 'Keir Account',
            openingBalance: '-39,202.45',
            lastLogin: '2026-01-13 06:21:14'
        },
        {
            id: 2,
            voucherNo: 'CUST00002',
            nameEnglish: 'Protiong',
            nameArabic: 'بروتيونغ',
            contact: '+9574632148',
            email: 'protiong@teleworm.us',
            accountType: 'Debtors',
            accountName: 'Protiong Account',
            openingBalance: '500.00',
            lastLogin: '-'
        },
        {
            id: 3,
            voucherNo: 'CUST00003',
            nameEnglish: 'Ida F. Mullen',
            nameArabic: 'ايدا ف. مولن',
            contact: '+9857453541',
            email: 'Idafmullen@armyspy.com',
            accountType: 'Debtors',
            accountName: 'Ida Account',
            openingBalance: '-56,013.18',
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

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setShowEditModal(true);
    };

    const handleDelete = (customer) => {
        setSelectedCustomer(customer);
        setShowDeleteModal(true);
    };

    return (
        <div className="Customers-customers-page">
            <div className="Customers-page-header">
                <h1 className="Customers-page-title">Customers</h1>
                <button className="Customers-btn-add" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add New Customer
                </button>
            </div>

            <div className="Customers-customers-card">
                <div className="Customers-controls-row">
                    <div className="Customers-entries-control">
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            className="Customers-entries-select"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="Customers-entries-text">entries per page</span>
                    </div>
                    <div className="Customers-search-control">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="Customers-search-input"
                        />
                    </div>
                </div>

                <div className="Customers-table-container">
                    <table className="Customers-customers-table">
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
                            {customers.map((cust, index) => (
                                <tr key={cust.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="Customers-voucher-badge" style={{ cursor: 'pointer' }} onClick={() => navigate(`/company/accounts/customers/${cust.id}`)}>
                                            #{cust.voucherNo}
                                        </div>
                                    </td>
                                    <td>{cust.nameEnglish}</td>
                                    <td>{cust.nameArabic}</td>
                                    <td>{cust.contact}</td>
                                    <td>{cust.email}</td>
                                    <td>{cust.accountType}</td>
                                    <td>{cust.accountName}</td>
                                    <td className={cust.openingBalance.startsWith('-') ? 'Customers-text-danger' : 'Customers-text-success'}>
                                        ${cust.openingBalance}
                                    </td>
                                    <td>
                                        <div className="Customers-action-buttons">
                                            <button className="Customers-action-btn Customers-btn-view" data-tooltip="View" onClick={() => navigate(`/company/accounts/customers/${cust.id}`)}>
                                                <Eye size={18} />
                                            </button>
                                            <button className="Customers-action-btn Customers-btn-edit" data-tooltip="Edit" onClick={() => handleEdit(cust)}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="Customers-action-btn Customers-btn-delete" data-tooltip="Delete" onClick={() => handleDelete(cust)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="Customers-pagination-row">
                    <p className="Customers-pagination-info">Showing 1 to {customers.length} of {customers.length} entries</p>
                    <div className="Customers-pagination-controls">
                        <button className="Customers-pagination-btn Customers-disabled">Previous</button>
                        <button className="Customers-pagination-btn Customers-active">1</button>
                        <button className="Customers-pagination-btn Customers-disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="Customers-modal-overlay">
                    <div className="Customers-modal-content Customers-modal-large">
                        <div className="Customers-modal-header">
                            <h2 className="Customers-modal-title">Add Customer</h2>
                            <button className="Customers-close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="Customers-modal-body">
                            {/* Previous fields... */}
                            <div className="Customers-form-row Customers-three-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Name (English) <span className="Customers-text-red">*</span></label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter Name (English)" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Name (Arabic)</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter Name (Arabic)" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Company Name</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter company name" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-mixed-col">
                                <div className="Customers-form-group Customers-google-loc">
                                    <label className="Customers-form-label">Company Google Location</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter Google Maps link" />
                                </div>
                                <div className="Customers-form-group Customers-profile-img">
                                    <label className="Customers-form-label">Profile Image</label>
                                    <div className="Customers-file-input-wrapper">
                                        <input type="file" id="profileImg" className="Customers-file-input" />
                                        <label htmlFor="profileImg" className="Customers-file-label">
                                            <span className="Customers-file-btn">Choose File</span>
                                            <span className="Customers-file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="Customers-file-note">JPEG, PNG or JPG (max 5MB)</small>
                                </div>
                                <div className="Customers-form-group Customers-any-file">
                                    <label className="Customers-form-label">Any File</label>
                                    <div className="Customers-file-input-wrapper">
                                        <input type="file" id="anyFile" className="Customers-file-input" />
                                        <label htmlFor="anyFile" className="Customers-file-label">
                                            <span className="Customers-file-btn">Choose File</span>
                                            <span className="Customers-file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="Customers-file-note">Any file type. If image, max 5MB</small>
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Account Type <span className="Customers-text-red">*</span></label>
                                    <select className="Customers-form-select">
                                        <option value="">-- Select Account --</option>
                                        <option value="debtors">Debtors</option>
                                    </select>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Balance Type</label>
                                    <select className="Customers-form-select">
                                        <option value="debit">Debit</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Account Name <span className="Customers-text-red">*</span></label>
                                    <input type="text" className="Customers-form-input" placeholder="This will auto-fill from selection above" readOnly />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Account Balance <span className="Customers-text-red">*</span></label>
                                    <input type="text" className="Customers-form-input" defaultValue="0.00" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Creation Date <span className="Customers-text-red">*</span></label>
                                    <input type="date" className="Customers-form-input" defaultValue="2026-01-13" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Bank Account Number</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter bank account number" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Bank IFSC</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter bank IFSC" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Bank Name & Branch</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter bank name & branch" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Phone <span className="Customers-text-red">*</span></label>
                                    <div className="Customers-input-with-note">
                                        <input type="text" className="Customers-form-input" placeholder="Enter Phone" />

                                    </div>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Email <span className="Customers-text-red">*</span></label>
                                    <input type="email" className="Customers-form-input" placeholder="Enter Email" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col" style={{ alignItems: 'flex-start' }}>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Credit Period (days)</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter credit period" />
                                </div>
                                <div className="Customers-form-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label className="Customers-form-label" style={{ marginBottom: 0 }}>GSTIN <span className="Customers-text-red">*</span></label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Enable GST</span>
                                            <label className="Customers-switch">
                                                <input type="checkbox" checked={enableGst} onChange={(e) => setEnableGst(e.target.checked)} />
                                                <span className="Customers-slider Customers-round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <input type="text" className="Customers-form-input" placeholder="Enter GSTIN" disabled={!enableGst} />
                                </div>
                            </div>

                            {/* Billing Address Section */}
                            <div className="Customers-form-section">
                                <h3 className="Customers-section-subtitle">Billing Address</h3>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Name</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Name"
                                            name="name" value={billingData.name} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Phone</label>
                                        <div className="Customers-input-with-note">
                                            <input
                                                type="text" className="Customers-form-input" placeholder="Enter Phone"
                                                name="phone" value={billingData.phone} onChange={handleBillingChange}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Address</label>
                                    <textarea
                                        className="Customers-form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={billingData.address} onChange={handleBillingChange}
                                    ></textarea>
                                </div>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">City</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter City"
                                            name="city" value={billingData.city} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">State</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter State"
                                            name="state" value={billingData.state} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Country</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Country"
                                            name="country" value={billingData.country} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Zip Code</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Zip Code"
                                            name="zip" value={billingData.zip} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address Section */}
                            <div className="Customers-form-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 className="Customers-section-subtitle" style={{ marginBottom: 0 }}>Shipping Address</h3>
                                    <button className="Customers-btn-action-small" onClick={handleSameAsBilling}>Shipping Same As Billing</button>
                                </div>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Name</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Name"
                                            name="name" value={shippingData.name} onChange={handleShippingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Phone</label>
                                        <div className="Customers-input-with-note">
                                            <input
                                                type="text" className="Customers-form-input" placeholder="Enter Phone"
                                                name="phone" value={shippingData.phone} onChange={handleShippingChange}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Address</label>
                                    <textarea
                                        className="Customers-form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={shippingData.address} onChange={handleShippingChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="Customers-modal-footer">
                            <button className="Customers-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="Customers-btn-save" style={{ backgroundColor: '#8ce043' }}>Save Customer</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Edit Modal */}
            {showEditModal && (
                <div className="Customers-modal-overlay">
                    <div className="Customers-modal-content Customers-modal-large">
                        <div className="Customers-modal-header">
                            <h2 className="Customers-modal-title">Edit Customer</h2>
                            <button className="Customers-close-btn" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="Customers-modal-body">
                            <div className="Customers-form-row Customers-three-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Name (English) <span className="Customers-text-red">*</span></label>
                                    <input type="text" className="Customers-form-input" defaultValue={selectedCustomer?.nameEnglish} placeholder="Enter Name (English)" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Name (Arabic)</label>
                                    <input type="text" className="Customers-form-input" defaultValue={selectedCustomer?.nameArabic} placeholder="Enter Name (Arabic)" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Company Name</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter company name" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-mixed-col">
                                <div className="Customers-form-group Customers-google-loc">
                                    <label className="Customers-form-label">Company Google Location</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter Google Maps link" />
                                </div>
                                <div className="Customers-form-group Customers-profile-img">
                                    <label className="Customers-form-label">Profile Image</label>
                                    <div className="Customers-file-input-wrapper">
                                        <input type="file" id="editProfileImg" className="Customers-file-input" />
                                        <label htmlFor="editProfileImg" className="Customers-file-label">
                                            <span className="Customers-file-btn">Choose File</span>
                                            <span className="Customers-file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="Customers-file-note">JPEG, PNG or JPG (max 5MB)</small>
                                </div>
                                <div className="Customers-form-group Customers-any-file">
                                    <label className="Customers-form-label">Any File</label>
                                    <div className="Customers-file-input-wrapper">
                                        <input type="file" id="editAnyFile" className="Customers-file-input" />
                                        <label htmlFor="editAnyFile" className="Customers-file-label">
                                            <span className="Customers-file-btn">Choose File</span>
                                            <span className="Customers-file-name">No file chosen</span>
                                        </label>
                                    </div>
                                    <small className="Customers-file-note">Any file type. If image, max 5MB</small>
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Account Type <span className="Customers-text-red">*</span></label>
                                    <select className="Customers-form-select" defaultValue={selectedCustomer?.accountType.toLowerCase()}>
                                        <option value="">-- Select Account --</option>
                                        <option value="debtors">Debtors</option>
                                    </select>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Balance Type</label>
                                    <select className="Customers-form-select" defaultValue="debit">
                                        <option value="debit">Debit</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Account Name <span className="Customers-text-red">*</span></label>
                                    <input type="text" className="Customers-form-input" defaultValue={selectedCustomer?.accountName} placeholder="This will auto-fill from selection above" readOnly />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Account Balance <span className="Customers-text-red">*</span></label>
                                    <input type="text" className="Customers-form-input" defaultValue={selectedCustomer?.openingBalance.replace('$', '')} />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Creation Date <span className="Customers-text-red">*</span></label>
                                    <input type="date" className="Customers-form-input" defaultValue="2026-01-13" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Bank Account Number</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter bank account number" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Bank IFSC</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter bank IFSC" />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Bank Name & Branch</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter bank name & branch" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Phone <span className="Customers-text-red">*</span></label>
                                    <div className="Customers-input-with-note">
                                        <input type="text" className="Customers-form-input" defaultValue={selectedCustomer?.contact} placeholder="Enter Phone" />
                                    </div>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Email <span className="Customers-text-red">*</span></label>
                                    <input type="email" className="Customers-form-input" defaultValue={selectedCustomer?.email} placeholder="Enter Email" />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col" style={{ alignItems: 'flex-start' }}>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Credit Period (days)</label>
                                    <input type="text" className="Customers-form-input" placeholder="Enter credit period" />
                                </div>
                                <div className="Customers-form-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label className="Customers-form-label" style={{ marginBottom: 0 }}>GSTIN <span className="Customers-text-red">*</span></label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Enable GST</span>
                                            <label className="Customers-switch">
                                                <input type="checkbox" checked={enableGst} onChange={(e) => setEnableGst(e.target.checked)} />
                                                <span className="Customers-slider Customers-round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <input type="text" className="Customers-form-input" placeholder="Enter GSTIN" disabled={!enableGst} />
                                </div>
                            </div>

                            {/* Billing Address Section */}
                            <div className="Customers-form-section">
                                <h3 className="Customers-section-subtitle">Billing Address</h3>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Name</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Name"
                                            name="name" value={billingData.name} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Phone</label>
                                        <div className="Customers-input-with-note">
                                            <input
                                                type="text" className="Customers-form-input" placeholder="Enter Phone"
                                                name="phone" value={billingData.phone} onChange={handleBillingChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Address</label>
                                    <textarea
                                        className="Customers-form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={billingData.address} onChange={handleBillingChange}
                                    ></textarea>
                                </div>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">City</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter City"
                                            name="city" value={billingData.city} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">State</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter State"
                                            name="state" value={billingData.state} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Country</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Country"
                                            name="country" value={billingData.country} onChange={handleBillingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Zip Code</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Zip Code"
                                            name="zip" value={billingData.zip} onChange={handleBillingChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address Section */}
                            <div className="Customers-form-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 className="Customers-section-subtitle" style={{ marginBottom: 0 }}>Shipping Address</h3>
                                    <button className="Customers-btn-action-small" onClick={handleSameAsBilling}>Shipping Same As Billing</button>
                                </div>
                                <div className="Customers-form-row Customers-two-col">
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Name</label>
                                        <input
                                            type="text" className="Customers-form-input" placeholder="Enter Name"
                                            name="name" value={shippingData.name} onChange={handleShippingChange}
                                        />
                                    </div>
                                    <div className="Customers-form-group">
                                        <label className="Customers-form-label">Phone</label>
                                        <div className="Customers-input-with-note">
                                            <input
                                                type="text" className="Customers-form-input" placeholder="Enter Phone"
                                                name="phone" value={shippingData.phone} onChange={handleShippingChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Address</label>
                                    <textarea
                                        className="Customers-form-textarea" placeholder="Enter Address" rows="2"
                                        name="address" value={shippingData.address} onChange={handleShippingChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="Customers-modal-footer">
                            <button className="Customers-btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="Customers-btn-save" style={{ backgroundColor: '#8ce043' }}>Update Customer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="Customers-modal-overlay">
                    <div className="Customers-modal-content" style={{ maxWidth: '400px' }}>
                        <div className="Customers-modal-header">
                            <h2 className="Customers-modal-title">Delete Customer</h2>
                            <button className="Customers-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="Customers-modal-body">
                            <p>Are you sure you want to delete customer <strong>{selectedCustomer?.nameEnglish}</strong>?</p>
                        </div>
                        <div className="Customers-modal-footer">
                            <button className="Customers-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="Customers-btn-save Customers-btn-danger-action" style={{ backgroundColor: '#ff5252' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
