import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import serviceService from '../../../../services/serviceService';
import uomService from '../../../../services/uomService';
import './Services.css';

const Services = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        remarks: '',
        unitId: '',
        price: '',
        taxPercent: '',
        allowInInvoices: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [servicesData, unitsData] = await Promise.all([
                serviceService.getServices(),
                uomService.getUnits()
            ]);
            setServices(servicesData);
            setUnits(unitsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error('Service name is required');
            return;
        }

        try {
            const submitData = {
                ...formData,
                unitId: formData.unitId ? parseInt(formData.unitId) : null,
                price: parseFloat(formData.price) || 0,
                taxPercent: parseFloat(formData.taxPercent) || 0
            };

            if (showEditModal && selectedService) {
                await serviceService.updateService(selectedService.id, submitData);
                toast.success('Service updated successfully');
            } else {
                await serviceService.createService(submitData);
                toast.success('Service created successfully');
            }
            fetchData();
            closeModals();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error(error.response?.data?.message || 'Failed to save service');
        }
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            description: '',
            remarks: '',
            unitId: '',
            price: '',
            taxPercent: '',
            allowInInvoices: true
        });
    };

    const handleView = (service) => {
        setSelectedService(service);
        setShowViewModal(true);
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            sku: service.sku || '',
            description: service.description || '',
            remarks: service.remarks || '',
            unitId: service.unitId || '',
            price: service.price || '',
            taxPercent: service.taxPercent || '',
            allowInInvoices: service.allowInInvoices !== false
        });
        setShowEditModal(true);
    };

    const handleDelete = (service) => {
        setSelectedService(service);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await serviceService.deleteService(selectedService.id);
            toast.success('Service deleted successfully');
            fetchData();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error(error.response?.data?.message || 'Failed to delete service');
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="services-page">
                <div className="loading">Loading services...</div>
            </div>
        );
    }

    return (
        <div className="services-page">
            <div className="page-header">
                <h1 className="page-title">Services</h1>
                <button className="btn-add" style={{ backgroundColor: '#8ce043' }} onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                }}>
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            <div className="services-card">
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
                    <table className="services-table">
                        <thead>
                            <tr>
                                <th>SERVICE NAME</th>
                                <th>SERVICE DESCRIPTION</th>
                                <th>UNIT OF MEASURE</th>
                                <th>PRICE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">No services found</td>
                                </tr>
                            ) : (
                                filteredServices.slice(0, entriesPerPage).map((s) => (
                                    <tr key={s.id}>
                                        <td className="font-semibold">{s.name}</td>
                                        <td>{s.description || '-'}</td>
                                        <td>{s.unit?.name || '-'}</td>
                                        <td>{formatCurrency(s.price)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn btn-view" data-tooltip="View" onClick={() => handleView(s)}>
                                                    <Eye size={16} />
                                                </button>
                                                <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(s)}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(s)}>
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
                    <p className="pagination-info">Showing 1 to {Math.min(entriesPerPage, filteredServices.length)} of {filteredServices.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Service Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal-overlay">
                    <div className="modal-content services-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{showEditModal ? 'Edit Service' : 'Add Service'}</h2>
                            <button className="close-btn" onClick={closeModals}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Service Name <span className="text-red">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder="Enter service name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    className="form-input"
                                    placeholder="Enter SKU (optional)"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Service Description</label>
                                <textarea
                                    name="description"
                                    className="form-input textarea"
                                    placeholder="Describe the service"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Unit of Measure</label>
                                <select
                                    name="unitId"
                                    className="form-input"
                                    value={formData.unitId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price <span className="text-red">*</span></label>
                                <input
                                    type="number"
                                    name="price"
                                    className="form-input"
                                    placeholder="Enter price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Default Tax %</label>
                                <input
                                    type="number"
                                    name="taxPercent"
                                    className="form-input"
                                    placeholder="e.g. 18"
                                    value={formData.taxPercent}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-checkbox-group">
                                <input
                                    type="checkbox"
                                    id="allowInvoices"
                                    name="allowInInvoices"
                                    checked={formData.allowInInvoices}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="allowInvoices" className="checkbox-label">Allow this service to be added in invoices</label>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Remarks</label>
                                <textarea
                                    name="remarks"
                                    className="form-input textarea"
                                    placeholder="Internal notes (not visible to customers)"
                                    rows={3}
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                ></textarea>
                                <p className="form-help-text">Remarks are for internal use only; they do not display anywhere.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeModals}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }} onClick={handleSubmit}>
                                {showEditModal ? 'Update Service' : 'Save Service'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Service Modal */}
            {showViewModal && (
                <div className="modal-overlay">
                    <div className="modal-content services-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Service Details</h2>
                            <button className="close-btn" onClick={closeModals}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-grid">
                                <div className="view-item">
                                    <label>Service Name</label>
                                    <p>{selectedService?.name}</p>
                                </div>
                                <div className="view-item">
                                    <label>SKU</label>
                                    <p>{selectedService?.sku || 'N/A'}</p>
                                </div>
                                <div className="view-item full">
                                    <label>Description</label>
                                    <p>{selectedService?.description || 'N/A'}</p>
                                </div>
                                <div className="view-item">
                                    <label>Unit of Measure</label>
                                    <p>{selectedService?.unit?.name || 'N/A'}</p>
                                </div>
                                <div className="view-item">
                                    <label>Price</label>
                                    <p>{formatCurrency(selectedService?.price)}</p>
                                </div>
                                <div className="view-item">
                                    <label>Tax %</label>
                                    <p>{selectedService?.taxPercent || 0}%</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeModals}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Service</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete service <strong>{selectedService?.name}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#ff4d4d' }} onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
