import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import './UOM.css';

const UOM = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const categories = ['Weight', 'Area', 'Volume', 'Length', 'Count'];
    const unitsByCategory = {
        'Weight': ['KG', 'Gram', 'Milligram', 'Pound', 'Ounce'],
        'Area': ['Square Meter', 'Square Foot', 'Acre', 'Hectare'],
        'Volume': ['Litre', 'Millilitre', 'Cubic Meter', 'Gallon'],
        'Length': ['Meter', 'Centimeter', 'Millimeter', 'Inch', 'Foot'],
        'Count': ['Piece', 'Dozen', 'Box', 'Packet']
    };

    const [uoms, setUoms] = useState([
        { id: 1, name: 'Kilogram', category: 'Weight', weightPerUnit: '1 KG' },
        { id: 2, name: 'Litre', category: 'Volume', weightPerUnit: '1 LTR' },
        { id: 3, name: 'Meter', category: 'Length', weightPerUnit: '1 MTR' }
    ]);

    const [formData, setFormData] = useState({
        category: '',
        unit: '',
        weightPerUnit: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset unit if category changes
            ...(name === 'category' ? { unit: '' } : {})
        }));
    };

    const handleEdit = (unit) => {
        setSelectedUnit(unit);
        setFormData({
            category: unit.category,
            unit: unit.name,
            weightPerUnit: unit.weightPerUnit
        });
        setShowEditModal(true);
    };

    const handleDelete = (unit) => {
        setSelectedUnit(unit);
        setShowDeleteModal(true);
    };

    return (
        <div className="uom-page">
            <div className="page-header">
                <h1 className="page-title">Unit of Measure</h1>
                <button className="btn-add" onClick={() => {
                    setFormData({ category: '', unit: '', weightPerUnit: '' });
                    setShowAddModal(true);
                }}>
                    <Plus size={18} />
                    Add Unit
                </button>
            </div>

            <div className="uom-card">
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
                    <table className="uom-table">
                        <thead>
                            <tr>
                                <th>S.NO</th>
                                <th>UNIT NAME</th>
                                <th>CATEGORY</th>
                                <th>WEIGHT PER UNIT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uoms.map((unit, index) => (
                                <tr key={unit.id}>
                                    <td>{index + 1}</td>
                                    <td>{unit.name}</td>
                                    <td>
                                        <span className="category-badge">{unit.category}</span>
                                    </td>
                                    <td>{unit.weightPerUnit}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-edit" data-tooltip="Edit" onClick={() => handleEdit(unit)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="action-btn btn-delete" data-tooltip="Delete" onClick={() => handleDelete(unit)}>
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
                    <p className="pagination-info">Showing 1 to {uoms.length} of {uoms.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Unit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal-overlay">
                    <div className="modal-content uom-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{showEditModal ? 'Edit Unit Details' : 'Unit Details'}</h2>
                            <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Measurement Category <span className="text-red">*</span></label>
                                <select
                                    name="category"
                                    className="form-input"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Unit of Measurement (UOM) <span className="text-red">*</span></label>
                                <select
                                    name="unit"
                                    className="form-input"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    disabled={!formData.category}
                                >
                                    <option value="">Select Unit</option>
                                    {formData.category && unitsByCategory[formData.category].map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Weight per Unit <span className="text-red">*</span></label>
                                <input
                                    type="text"
                                    name="weightPerUnit"
                                    className="form-input"
                                    placeholder="e.g. 0.5 KG"
                                    value={formData.weightPerUnit}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close-modal" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Close</button>
                            <button className="btn-save-modal">{showEditModal ? 'Update' : 'Save'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Unit</h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete unit <strong>{selectedUnit?.name}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close-modal" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-save-modal" style={{ backgroundColor: '#f06292' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UOM;
