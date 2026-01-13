import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import './Warehouse.css';

const Warehouse = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    // Mock data for the table
    const [warehouses] = useState([
        { id: 1, name: 'Main Warehouse', stocks: '1,250', location: 'New York, USA', address1: '123 Tech Ave', address2: 'Ste 400', city: 'NY', state: 'NY', pincode: '10001', country: 'USA' },
        { id: 2, name: 'Central Distribution', stocks: '4,800', location: 'London, UK', address1: '45 Export Rd', address2: '', city: 'London', state: 'Greater London', pincode: 'EC1A 1BB', country: 'UK' },
        { id: 3, name: 'East Side Storage', stocks: '960', location: 'Berlin, DE', address1: 'Lindenberger Str 12', address2: '', city: 'Berlin', state: 'Berlin', pincode: '10115', country: 'DE' }
    ]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (wh) => {
        setSelectedWarehouse(wh);
        setFormData({
            name: wh.name,
            location: wh.location,
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

    return (
        <div className="warehouse-page">
            <div className="page-header">
                <h1 className="page-title">Warehouse</h1>
                <button className="btn-add" onClick={() => {
                    setFormData({ name: '', location: '', address1: '', address2: '', city: '', state: '', pincode: '', country: '' });
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
                            {warehouses.map((wh, index) => (
                                <tr key={wh.id}>
                                    <td>{index + 1}</td>
                                    <td>{wh.name}</td>
                                    <td>{wh.stocks}</td>
                                    <td>{wh.location}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {warehouses.length} of {warehouses.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Create Warehouse Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content warehouse-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Create Warehouse</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
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
                                    <label className="form-label">Location <span className="text-red">*</span></label>
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
                            <button className="btn-close-modal" onClick={() => setShowAddModal(false)}>Close</button>
                            <button className="btn-create-modal">Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Warehouse Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content warehouse-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Warehouse</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
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
                                    <label className="form-label">Location <span className="text-red">*</span></label>
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
                            <button className="btn-close-modal" onClick={() => setShowEditModal(false)}>Close</button>
                            <button className="btn-create-modal" style={{ backgroundColor: '#4dd0e1' }}>Update</button>
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
                            <button className="btn-create-modal" style={{ backgroundColor: '#f06292' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Warehouse;
