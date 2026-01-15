import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import customerService from '../../../services/customerService';
import './Customers.css';

const Customers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
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
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.getCustomers();
            setCustomers(data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
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
        setSelectedCustomer(null);
    };

    const handleCreate = async () => {
        try {
            if (!formData.name) {
                toast.error('Customer name is required');
                return;
            }
            await customerService.createCustomer(formData);
            toast.success('Customer created successfully');
            setShowAddModal(false);
            resetForm();
            fetchCustomers();
        } catch (error) {
            console.error('Error creating customer:', error);
            toast.error(error.response?.data?.error || 'Failed to create customer');
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setFormData({
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            gstNumber: customer.gstNumber || '',
            creditLimit: customer.creditLimit || 0,
            creditDays: customer.creditDays || 0,
            openingBalance: customer.openingBalance || 0
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            if (!selectedCustomer) return;
            await customerService.updateCustomer(selectedCustomer.id, formData);
            toast.success('Customer updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchCustomers();
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error(error.response?.data?.error || 'Failed to update customer');
        }
    };

    const handleDeleteClick = (customer) => {
        setSelectedCustomer(customer);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            if (!selectedCustomer) return;
            await customerService.deleteCustomer(selectedCustomer.id);
            toast.success('Customer deleted successfully');
            setShowDeleteModal(false);
            setSelectedCustomer(null);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error(error.response?.data?.error || 'Failed to delete customer');
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredCustomers = customers.filter(cust =>
        cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.phone?.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="Customers-customers-page">
                <div className="Customers-loading">Loading customers...</div>
            </div>
        );
    }

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
                        <button className="Customers-btn-refresh" onClick={fetchCustomers}>
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </div>

                <div className="Customers-table-container">
                    <table className="Customers-customers-table">
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
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="text-center">No customers found</td>
                                </tr>
                            ) : (
                                filteredCustomers.slice(0, entriesPerPage).map((cust, index) => (
                                    <tr key={cust.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span
                                                className="Customers-name-link"
                                                onClick={() => navigate(`/company/accounts/customers/${cust.id}`)}
                                            >
                                                {cust.name}
                                            </span>
                                        </td>
                                        <td>{cust.phone || '-'}</td>
                                        <td>{cust.email || '-'}</td>
                                        <td>{cust.gstNumber || '-'}</td>
                                        <td>{formatCurrency(cust.creditLimit)}</td>
                                        <td>{cust.creditDays || 0} days</td>
                                        <td className={cust.currentBalance < 0 ? 'Customers-text-danger' : 'Customers-text-success'}>
                                            {formatCurrency(cust.currentBalance)}
                                        </td>
                                        <td>
                                            <span className={`Customers-status-badge ${cust.isActive ? 'Customers-status-active' : 'Customers-status-inactive'}`}>
                                                {cust.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="Customers-action-buttons">
                                                <button
                                                    className="Customers-action-btn Customers-btn-view"
                                                    data-tooltip="View"
                                                    onClick={() => navigate(`/company/accounts/customers/${cust.id}`)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className="Customers-action-btn Customers-btn-edit"
                                                    data-tooltip="Edit"
                                                    onClick={() => handleEdit(cust)}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    className="Customers-action-btn Customers-btn-delete"
                                                    data-tooltip="Delete"
                                                    onClick={() => handleDeleteClick(cust)}
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

                <div className="Customers-pagination-row">
                    <p className="Customers-pagination-info">
                        Showing 1 to {Math.min(entriesPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries
                    </p>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="Customers-modal-overlay">
                    <div className="Customers-modal-content Customers-modal-large">
                        <div className="Customers-modal-header">
                            <h2 className="Customers-modal-title">Add Customer</h2>
                            <button className="Customers-close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>×</button>
                        </div>
                        <div className="Customers-modal-body">
                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Name <span className="Customers-text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="Customers-form-input"
                                        placeholder="Enter customer name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="Customers-form-input"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="Customers-form-input"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">GST Number</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        className="Customers-form-input"
                                        placeholder="Enter GST number"
                                        value={formData.gstNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Customers-form-group">
                                <label className="Customers-form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="Customers-form-textarea"
                                    placeholder="Enter address"
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="Customers-form-row Customers-three-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Credit Limit</label>
                                    <input
                                        type="number"
                                        name="creditLimit"
                                        className="Customers-form-input"
                                        placeholder="0.00"
                                        value={formData.creditLimit}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Credit Days</label>
                                    <input
                                        type="number"
                                        name="creditDays"
                                        className="Customers-form-input"
                                        placeholder="0"
                                        value={formData.creditDays}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Opening Balance</label>
                                    <input
                                        type="number"
                                        name="openingBalance"
                                        className="Customers-form-input"
                                        placeholder="0.00"
                                        value={formData.openingBalance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Customers-modal-footer">
                            <button className="Customers-btn-cancel" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                            <button className="Customers-btn-save" onClick={handleCreate}>Save Customer</button>
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
                            <button className="Customers-close-btn" onClick={() => { setShowEditModal(false); resetForm(); }}>×</button>
                        </div>
                        <div className="Customers-modal-body">
                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Name <span className="Customers-text-red">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="Customers-form-input"
                                        placeholder="Enter customer name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="Customers-form-input"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="Customers-form-input"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">GST Number</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        className="Customers-form-input"
                                        placeholder="Enter GST number"
                                        value={formData.gstNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Customers-form-group">
                                <label className="Customers-form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="Customers-form-textarea"
                                    placeholder="Enter address"
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="Customers-form-row Customers-two-col">
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Credit Limit</label>
                                    <input
                                        type="number"
                                        name="creditLimit"
                                        className="Customers-form-input"
                                        placeholder="0.00"
                                        value={formData.creditLimit}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Customers-form-group">
                                    <label className="Customers-form-label">Credit Days</label>
                                    <input
                                        type="number"
                                        name="creditDays"
                                        className="Customers-form-input"
                                        placeholder="0"
                                        value={formData.creditDays}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Customers-modal-footer">
                            <button className="Customers-btn-cancel" onClick={() => { setShowEditModal(false); resetForm(); }}>Cancel</button>
                            <button className="Customers-btn-save" onClick={handleUpdate}>Update Customer</button>
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
                            <button className="Customers-close-btn" onClick={() => { setShowDeleteModal(false); setSelectedCustomer(null); }}>×</button>
                        </div>
                        <div className="Customers-modal-body">
                            <p>Are you sure you want to delete customer <strong>{selectedCustomer?.name}</strong>?</p>
                            <p style={{ color: '#ff5252', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="Customers-modal-footer">
                            <button className="Customers-btn-cancel" onClick={() => { setShowDeleteModal(false); setSelectedCustomer(null); }}>Cancel</button>
                            <button className="Customers-btn-save" style={{ backgroundColor: '#ff5252' }} onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
