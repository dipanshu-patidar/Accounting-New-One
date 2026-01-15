import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import vendorService from '../../../services/vendorService';
import './Vendors.css';

const Vendors = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
        creditLimit: 0,
        creditDays: 0,
        openingBalance: 0
    });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const data = await vendorService.getVendors();
            setVendors(data || []);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Failed to fetch vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            gstNumber: '',
            creditLimit: 0,
            creditDays: 0,
            openingBalance: 0
        });
        setSelectedVendor(null);
    };

    const handleCreate = async () => {
        try {
            if (!formData.name) {
                toast.error('Vendor name is required');
                return;
            }
            await vendorService.createVendor(formData);
            toast.success('Vendor created successfully');
            setShowAddModal(false);
            resetForm();
            fetchVendors();
        } catch (error) {
            console.error('Error creating vendor:', error);
            toast.error(error.response?.data?.error || 'Failed to create vendor');
        }
    };

    const handleEdit = (vendor) => {
        setSelectedVendor(vendor);
        setFormData({
            name: vendor.name || '',
            email: vendor.email || '',
            phone: vendor.phone || '',
            address: vendor.address || '',
            gstNumber: vendor.gstNumber || '',
            creditLimit: vendor.creditLimit || 0,
            creditDays: vendor.creditDays || 0,
            openingBalance: vendor.openingBalance || 0
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            if (!selectedVendor) return;
            await vendorService.updateVendor(selectedVendor.id, formData);
            toast.success('Vendor updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchVendors();
        } catch (error) {
            console.error('Error updating vendor:', error);
            toast.error(error.response?.data?.error || 'Failed to update vendor');
        }
    };

    const handleDeleteClick = (vendor) => {
        setSelectedVendor(vendor);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            if (!selectedVendor) return;
            await vendorService.deleteVendor(selectedVendor.id);
            toast.success('Vendor deleted successfully');
            setShowDeleteModal(false);
            setSelectedVendor(null);
            fetchVendors();
        } catch (error) {
            console.error('Error deleting vendor:', error);
            toast.error(error.response?.data?.error || 'Failed to delete vendor');
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredVendors = vendors.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="Vendors-customers-page">
                <div className="Vendors-loading">Loading vendors...</div>
            </div>
        );
    }

    return (
        <div className="Vendors-customers-page">
            <div className="Vendors-page-header">
                <h1 className="Vendors-page-title">Vendors</h1>
                <button className="Vendors-btn-add" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add New Vendor
                </button>
            </div>

            <div className="Vendors-customers-card">
                <div className="Vendors-controls-row">
                    <div className="Vendors-entries-control">
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            className="Vendors-entries-select"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="Vendors-entries-text">entries per page</span>
                    </div>
                    <div className="Vendors-search-control">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="Vendors-search-input"
                        />
                        <button className="Vendors-btn-refresh" onClick={fetchVendors}>
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </div>

                <div className="Vendors-table-container">
                    <table className="Vendors-customers-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>NAME</th>
                                <th>CONTACT</th>
                                <th>EMAIL</th>
                                <th>GST NUMBER</th>
                                <th>CREDIT LIMIT</th>
                                <th>CREDIT DAYS</th>
                                <th>BALANCE</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="text-center">No vendors found</td>
                                </tr>
                            ) : (
                                filteredVendors.slice(0, entriesPerPage).map((vendor, index) => (
                                    <tr key={vendor.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span
                                                className="Vendors-name-link"
                                                onClick={() => navigate(`/company/accounts/vendors/${vendor.id}`)}
                                            >
                                                {vendor.name}
                                            </span>
                                        </td>
                                        <td>{vendor.phone || '-'}</td>
                                        <td>{vendor.email || '-'}</td>
                                        <td>{vendor.gstNumber || '-'}</td>
                                        <td>{formatCurrency(vendor.creditLimit)}</td>
                                        <td>{vendor.creditDays || 0} days</td>
                                        <td className={vendor.currentBalance < 0 ? 'Vendors-text-danger' : 'Vendors-text-success'}>
                                            {formatCurrency(vendor.currentBalance)}
                                        </td>
                                        <td>
                                            <span className={`Vendors-status-badge ${vendor.isActive ? 'Vendors-status-active' : 'Vendors-status-inactive'}`}>
                                                {vendor.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="Vendors-action-buttons">
                                                <button
                                                    className="Vendors-action-btn Vendors-btn-view"
                                                    data-tooltip="View"
                                                    onClick={() => navigate(`/company/accounts/vendors/${vendor.id}`)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className="Vendors-action-btn Vendors-btn-edit"
                                                    data-tooltip="Edit"
                                                    onClick={() => handleEdit(vendor)}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    className="Vendors-action-btn Vendors-btn-delete"
                                                    data-tooltip="Delete"
                                                    onClick={() => handleDeleteClick(vendor)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="Vendors-pagination-row">
                    <p className="Vendors-pagination-info">
                        Showing 1 to {Math.min(entriesPerPage, filteredVendors.length)} of {filteredVendors.length} entries
                    </p>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="Vendors-modal-overlay">
                    <div className="Vendors-modal-content Vendors-modal-large">
                        <div className="Vendors-modal-header">
                            <h2 className="Vendors-modal-title">Add Vendor</h2>
                            <button className="Vendors-close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>×</button>
                        </div>
                        <div className="Vendors-modal-body">
                            <div className="Vendors-form-row Vendors-two-col">
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Name <span className="Vendors-text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="Vendors-form-input"
                                        placeholder="Enter vendor name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="Vendors-form-input"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Vendors-form-row Vendors-two-col">
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="Vendors-form-input"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">GST Number</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        className="Vendors-form-input"
                                        placeholder="Enter GST number"
                                        value={formData.gstNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Vendors-form-group">
                                <label className="Vendors-form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="Vendors-form-textarea"
                                    placeholder="Enter address"
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="Vendors-form-row Vendors-three-col">
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Credit Limit</label>
                                    <input
                                        type="number"
                                        name="creditLimit"
                                        className="Vendors-form-input"
                                        placeholder="0.00"
                                        value={formData.creditLimit}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Credit Days</label>
                                    <input
                                        type="number"
                                        name="creditDays"
                                        className="Vendors-form-input"
                                        placeholder="0"
                                        value={formData.creditDays}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Opening Balance</label>
                                    <input
                                        type="number"
                                        name="openingBalance"
                                        className="Vendors-form-input"
                                        placeholder="0.00"
                                        value={formData.openingBalance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Vendors-modal-footer">
                            <button className="Vendors-btn-cancel" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                            <button className="Vendors-btn-save" onClick={handleCreate}>Save Vendor</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="Vendors-modal-overlay">
                    <div className="Vendors-modal-content Vendors-modal-large">
                        <div className="Vendors-modal-header">
                            <h2 className="Vendors-modal-title">Edit Vendor</h2>
                            <button className="Vendors-close-btn" onClick={() => { setShowEditModal(false); resetForm(); }}>×</button>
                        </div>
                        <div className="Vendors-modal-body">
                            <div className="Vendors-form-row Vendors-two-col">
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Name <span className="Vendors-text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="Vendors-form-input"
                                        placeholder="Enter vendor name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="Vendors-form-input"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Vendors-form-row Vendors-two-col">
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="Vendors-form-input"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">GST Number</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        className="Vendors-form-input"
                                        placeholder="Enter GST number"
                                        value={formData.gstNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Vendors-form-group">
                                <label className="Vendors-form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="Vendors-form-textarea"
                                    placeholder="Enter address"
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="Vendors-form-row Vendors-two-col">
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Credit Limit</label>
                                    <input
                                        type="number"
                                        name="creditLimit"
                                        className="Vendors-form-input"
                                        placeholder="0.00"
                                        value={formData.creditLimit}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Vendors-form-group">
                                    <label className="Vendors-form-label">Credit Days</label>
                                    <input
                                        type="number"
                                        name="creditDays"
                                        className="Vendors-form-input"
                                        placeholder="0"
                                        value={formData.creditDays}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Vendors-modal-footer">
                            <button className="Vendors-btn-cancel" onClick={() => { setShowEditModal(false); resetForm(); }}>Cancel</button>
                            <button className="Vendors-btn-save" onClick={handleUpdate}>Update Vendor</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="Vendors-modal-overlay">
                    <div className="Vendors-modal-content" style={{ maxWidth: '400px' }}>
                        <div className="Vendors-modal-header">
                            <h2 className="Vendors-modal-title">Delete Vendor</h2>
                            <button className="Vendors-close-btn" onClick={() => { setShowDeleteModal(false); setSelectedVendor(null); }}>×</button>
                        </div>
                        <div className="Vendors-modal-body">
                            <p>Are you sure you want to delete vendor <strong>{selectedVendor?.name}</strong>?</p>
                            <p style={{ color: '#ff5252', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="Vendors-modal-footer">
                            <button className="Vendors-btn-cancel" onClick={() => { setShowDeleteModal(false); setSelectedVendor(null); }}>Cancel</button>
                            <button className="Vendors-btn-save" style={{ backgroundColor: '#ff5252' }} onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendors;
