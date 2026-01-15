import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import warehouseService from '../../../services/warehouseService';
import './Warehouse.css';

const Warehouse = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        country: ''
    });

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const data = await warehouseService.getWarehouses();
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            toast.error('Failed to fetch warehouses');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error('Warehouse name is required');
            return;
        }

        try {
            if (showEditModal && selectedWarehouse) {
                await warehouseService.updateWarehouse(selectedWarehouse.id, formData);
                toast.success('Warehouse updated successfully');
            } else {
                await warehouseService.createWarehouse(formData);
                toast.success('Warehouse created successfully');
            }
            fetchWarehouses();
            setShowAddModal(false);
            setShowEditModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving warehouse:', error);
            toast.error(error.response?.data?.message || 'Failed to save warehouse');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        });
    };

    const handleEdit = (wh) => {
        setSelectedWarehouse(wh);
        setFormData({
            name: wh.name,
            location: wh.location || '',
            address1: wh.address1 || '',
            address2: wh.address2 || '',
            city: wh.city || '',
            state: wh.state || '',
            pincode: wh.pincode || '',
            country: wh.country || ''
        });
        setShowEditModal(true);
    };

    const handleDelete = (wh) => {
        setSelectedWarehouse(wh);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await warehouseService.deleteWarehouse(selectedWarehouse.id);
            toast.success('Warehouse deleted successfully');
            fetchWarehouses();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            toast.error(error.response?.data?.message || 'Failed to delete warehouse');
        }
    };

    const filteredWarehouses = warehouses.filter(wh =>
        wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wh.location && wh.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatNumber = (num) => {
        if (!num) return '0';
        return new Intl.NumberFormat().format(num);
    };

    if (loading) {
        return (
            <div className="warehouse-page">
                <div className="loading">Loading warehouses...</div>
            </div>
        );
    }

    return (
        <div className="warehouse-page">
            <div className="page-header">
                <h1 className="page-title">Warehouse</h1>
                <button className="btn-add" onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                }}>
                    <Plus size={18} />
                    Create Warehouse
                </button>
            </div>

            <div className="warehouse-card">
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
                    <table className="warehouse-table">
                        <thead>
                            <tr>
                                <th>S.NO</th>
                                <th>WAREHOUSE NAME</th>
                                <th>TOTAL STOCKS</th>
                                <th>LOCATION</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWarehouses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">No warehouses found</td>
                                </tr>
                            ) : (
                                filteredWarehouses.slice(0, entriesPerPage).map((wh, index) => (
                                    <tr key={wh.id}>
                                        <td>{index + 1}</td>
                                        <td>{wh.name}</td>
                                        <td>{formatNumber(wh.totalStocks)}</td>
                                        <td>{wh.location || '-'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(wh)}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(wh)}>
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

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {Math.min(entriesPerPage, filteredWarehouses.length)} of {filteredWarehouses.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Create/Edit Warehouse Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal-overlay">
                    <div className="modal-content warehouse-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{showEditModal ? 'Edit Warehouse' : 'Create Warehouse'}</h2>
                            <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Warehouse Name <span className="text-red">*</span></label>
                                    <input
                                        type="text" name="name" className="form-input"
                                        placeholder="Enter warehouse name"
                                        value={formData.name} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text" name="location" className="form-input"
                                        placeholder="Enter location"
                                        value={formData.location} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address Line 1</label>
                                <input
                                    type="text" name="address1" className="form-input"
                                    placeholder="Street address, P.O. box, company name, etc."
                                    value={formData.address1} onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address Line 2</label>
                                <input
                                    type="text" name="address2" className="form-input"
                                    placeholder="Apartment, suite, unit, building, floor, etc."
                                    value={formData.address2} onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text" name="city" className="form-input"
                                        placeholder="City"
                                        value={formData.city} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State / Province</label>
                                    <input
                                        type="text" name="state" className="form-input"
                                        placeholder="State"
                                        value={formData.state} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Postal Code</label>
                                    <input
                                        type="text" name="pincode" className="form-input"
                                        placeholder="Pincode"
                                        value={formData.pincode} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input
                                    type="text" name="country" className="form-input"
                                    placeholder="Country"
                                    value={formData.country} onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close-modal" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Close</button>
                            <button className="btn-create-modal" onClick={handleSubmit}>
                                {showEditModal ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Warehouse</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete warehouse <strong>{selectedWarehouse?.name}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close-modal" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-create-modal" style={{ backgroundColor: '#f06292' }} onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Warehouse;
