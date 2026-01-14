import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye } from 'lucide-react';
import './Services.css';

const Services = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Mock data
    const [services] = useState([
        { id: 1, name: 'Web Development', description: 'Full stack web development services', uom: 'Hour', price: '$50.00' },
        { id: 2, name: 'UI/UX Design', description: 'User interface and experience design', uom: 'Project', price: '$1,200.00' },
        { id: 3, name: 'SEO Optimization', description: 'Search engine optimization for websites', uom: 'Month', price: '$300.00' },
        { id: 4, name: 'Content Writing', description: 'Blog post and article writing', uom: 'Word', price: '$0.10' },
        { id: 5, name: 'Logo Design', description: 'Professional logo branding', uom: 'Quantity', price: '$250.00' },
    ]);

    const handleView = (service) => {
        setSelectedService(service);
        setShowViewModal(true);
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowEditModal(true);
    };

    const handleDelete = (service) => {
        setSelectedService(service);
        setShowDeleteModal(true);
    };

    return (
        <div className="services-page">
            <div className="page-header">
                <h1 className="page-title">Services</h1>
                <button className="btn-add" style={{ backgroundColor: '#8ce043' }} onClick={() => setShowAddModal(true)}>
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
                            {services.map((s) => (
                                <tr key={s.id}>
                                    <td className="font-semibold">{s.name}</td>
                                    <td>{s.description}</td>
                                    <td>{s.uom}</td>
                                    <td>{s.price}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {services.length} of {services.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Service Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content services-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Add Service</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Service Name <span className="text-red">*</span></label>
                                <input type="text" className="form-input" placeholder="Enter service name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SKU</label>
                                <input type="text" className="form-input" placeholder="Enter SKU (optional)" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Service Description</label>
                                <textarea className="form-input textarea" placeholder="Describe the service" rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Unit of Measure <span className="text-red">*</span></label>
                                <select className="form-input">
                                    <option>IN</option>
                                    <option>Hour</option>
                                    <option>Day</option>
                                    <option>Project</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price <span className="text-red">*</span></label>
                                <input type="text" className="form-input" placeholder="Enter price" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Default Tax %</label>
                                <input type="text" className="form-input" placeholder="e.g. 18" />
                            </div>
                            <div className="form-checkbox-group">
                                <input type="checkbox" id="allowInvoices" defaultChecked />
                                <label htmlFor="allowInvoices" className="checkbox-label">Allow this service to be added in invoices</label>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Remarks</label>
                                <textarea className="form-input textarea" placeholder="Internal notes (not visible to customers)" rows={3}></textarea>
                                <p className="form-help-text">Remarks are for internal use only; they do not display anywhere.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Save Service</button>
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
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
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
                                    <p>{selectedService?.description}</p>
                                </div>
                                <div className="view-item">
                                    <label>Unit of Measure</label>
                                    <p>{selectedService?.uom}</p>
                                </div>
                                <div className="view-item">
                                    <label>Price</label>
                                    <p>{selectedService?.price}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Service Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content services-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Service</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Service Name <span className="text-red">*</span></label>
                                <input type="text" className="form-input" defaultValue={selectedService?.name} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SKU</label>
                                <input type="text" className="form-input" placeholder="Enter SKU (optional)" defaultValue={selectedService?.sku} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Service Description</label>
                                <textarea className="form-input textarea" rows={3} defaultValue={selectedService?.description}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Unit of Measure <span className="text-red">*</span></label>
                                <select className="form-input" defaultValue={selectedService?.uom}>
                                    <option>IN</option>
                                    <option>Hour</option>
                                    <option>Day</option>
                                    <option>Project</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price <span className="text-red">*</span></label>
                                <input type="text" className="form-input" defaultValue={selectedService?.price} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Default Tax %</label>
                                <input type="text" className="form-input" placeholder="e.g. 18" />
                            </div>
                            <div className="form-checkbox-group">
                                <input type="checkbox" id="editAllowInvoices" defaultChecked />
                                <label htmlFor="editAllowInvoices" className="checkbox-label">Allow this service to be added in invoices</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Update Service</button>
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
                            <button className="btn-submit" style={{ backgroundColor: '#ff4d4d' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
