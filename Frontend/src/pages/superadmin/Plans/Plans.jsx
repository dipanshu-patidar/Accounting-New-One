import React, { useState, useEffect } from 'react';
import {
    CreditCard, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Plans.css';
import planService from '../../../services/planService';

const Plans = () => {
    // --- State ---
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // For Edit Mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Form State
    const initialFormState = {
        name: '',
        basePrice: 0,
        currency: 'USD',
        invoiceLimit: '10 invoices',
        additionalInvoicePrice: 0,
        userLimit: '1 user',
        storageCapacity: '5 GB',
        billingCycle: 'Monthly',
        status: 'Active',
        modules: [
            { name: 'Account', price: 0, enabled: false },
            { name: 'Inventory', price: 0, enabled: false },
            { name: 'POS', price: 0, enabled: false },
            { name: 'Sales', price: 0, enabled: false },
            { name: 'Purchase', price: 0, enabled: false },
            { name: 'GST Report', price: 0, enabled: false },
            { name: 'User Management', price: 0, enabled: false },
        ],
        descriptions: ['']
    };

    const [formData, setFormData] = useState(initialFormState);

    // --- Helpers ---
    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await planService.getPlans();
            setPlans(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const calculateTotalPrice = () => {
        const base = parseFloat(formData.basePrice) || 0;
        const modulesTotal = formData.modules.reduce((sum, mod) => {
            return mod.enabled ? sum + (parseFloat(mod.price) || 0) : sum;
        }, 0);
        return (base + modulesTotal).toFixed(2);
    };

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleModuleToggle = (index) => {
        const newModules = [...formData.modules];
        newModules[index].enabled = !newModules[index].enabled;
        setFormData(prev => ({ ...prev, modules: newModules }));
    };

    const handleModulePriceChange = (index, value) => {
        const newModules = [...formData.modules];
        newModules[index].price = value;
        setFormData(prev => ({ ...prev, modules: newModules }));
    };

    const handleDescriptionChange = (index, value) => {
        const newDesc = [...formData.descriptions];
        newDesc[index] = value;
        setFormData(prev => ({ ...prev, descriptions: newDesc }));
    };

    const addDescriptionField = () => {
        setFormData(prev => ({ ...prev, descriptions: [...prev.descriptions, ''] }));
    };

    const removeDescriptionField = (index) => {
        const newDesc = formData.descriptions.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, descriptions: newDesc }));
    };

    // --- Modal Triggers ---
    const openCreateModal = () => {
        setFormData(initialFormState);
        setIsEditMode(false);
        setSelectedPlan(null);
        setShowCreateModal(true);
    };

    const openEditModal = (plan) => {
        const mappedModules = initialFormState.modules.map(defMod => {
            const existing = plan.modules?.find(m => m.name === defMod.name);
            return existing ? { ...existing } : { ...defMod };
        });

        setFormData({
            ...plan,
            invoiceLimit: plan.invoiceLimit || '10 invoices',
            userLimit: plan.userLimit || '1 user',
            storageCapacity: plan.storageCapacity || '5 GB',
            modules: mappedModules,
            descriptions: plan.descriptions && plan.descriptions.length > 0 ? plan.descriptions : ['']
        });
        setSelectedPlan(plan);
        setIsEditMode(true);
        setShowCreateModal(true);
    };

    const openViewModal = (plan) => {
        setSelectedPlan(plan);
        setShowViewModal(true);
    };

    const openDeleteModal = (plan) => {
        setSelectedPlan(plan);
        setShowDeleteModal(true);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                totalPrice: calculateTotalPrice()
            };

            if (isEditMode) {
                await planService.updatePlan(selectedPlan.id, payload);
                toast.success('Plan updated successfully');
            } else {
                await planService.createPlan(payload);
                toast.success('Plan created successfully');
            }
            setShowCreateModal(false);
            fetchPlans();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to save plan');
        }
    };

    const handleDelete = async () => {
        try {
            await planService.deletePlan(selectedPlan.id);
            toast.success('Plan deleted successfully');
            setShowDeleteModal(false);
            fetchPlans();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete plan');
        }
    };

    return (
        <div className="plans-page">
            <div className="page-header">
                <div className="page-title">
                    <CreditCard size={24} className="text-orange-500" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>Plans & Pricing</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '400' }}>
                            Manage your subscription plans, pricing options.
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-add-plan" onClick={openCreateModal}>
                        <Plus size={18} />
                        Add Plan
                    </button>
                </div>
            </div>

            <div className="content-card">
                {/* Controls */}
                <div className="table-controls">
                    <div className="entries-control">
                        <select className="entries-select">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span>entries per page</span>
                    </div>
                    <div className="search-control">
                        <input className="search-input" placeholder="Search..." />
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="plans-table">
                        <thead>
                            <tr>
                                <th>PLAN NAME</th>
                                <th>CURRENCY</th>
                                <th>BASE PRICE</th>
                                <th>TOTAL PRICE</th>
                                <th>INVOICE LIMIT</th>
                                <th>ADDITIONAL PRICE</th>
                                <th>USER LIMIT</th>
                                <th>STORAGE</th>
                                <th>BILLING</th>
                                <th>STATUS</th>
                                <th>MODULES</th>
                                <th>SUBSCRIBERS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="13" style={{ textAlign: 'center', padding: '2rem' }}>Loading plans...</td>
                                </tr>
                            ) : plans.length === 0 ? (
                                <tr>
                                    <td colSpan="13" style={{ textAlign: 'center', padding: '2rem' }}>No plans found.</td>
                                </tr>
                            ) : (
                                plans.map(plan => (
                                    <tr key={plan.id}>
                                        <td>
                                            <span className={`badge-plan bg-bronze`}>
                                                {plan.name}
                                            </span>
                                        </td>
                                        <td>{plan.currency}</td>
                                        <td>${plan.basePrice}</td>
                                        <td>${plan.totalPrice}</td>
                                        <td>{plan.invoiceLimit}</td>
                                        <td>${plan.additionalInvoicePrice}/invoice</td>
                                        <td>{plan.userLimit}</td>
                                        <td>{plan.storageCapacity}</td>
                                        <td>{plan.billingCycle}</td>
                                        <td>
                                            <span className="status-badge">{plan.status}</span>
                                        </td>
                                        <td>
                                            <div className="modules-list">
                                                {plan.modules?.filter(m => m.enabled).map((mod, idx) => (
                                                    <div key={idx} className="module-pill">
                                                        {mod.name} (${mod.price})
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td>{plan._count?.companies || 0}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="action-icon-btn btn-edit" title="Edit" onClick={() => openEditModal(plan)}>
                                                    <Edit size={14} />
                                                </button>
                                                <button className="action-icon-btn btn-view" title="View" onClick={() => openViewModal(plan)}>
                                                    <Eye size={14} />
                                                </button>
                                                <button className="action-icon-btn btn-delete" title="Delete" onClick={() => openDeleteModal(plan)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="table-footer">
                    <span className="showing-text">
                        Showing 1 to {plans.length} of {plans.length} entries
                    </span>
                    <div className="pagination">
                        <button className="page-btn" disabled><ChevronLeft size={16} /></button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn" disabled><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* --- CREATE / EDIT MODAL --- */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h3>{isEditMode ? 'Edit Plan' : 'Add New Plan (USD)'}</h3>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Row 1 */}
                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label>Plan Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Plan Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Base Price ($)</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Currency</label>
                                    <select name="currency" value={formData.currency} onChange={handleInputChange}>
                                        <option value="USD">USD ($) - US Dollar</option>
                                        <option value="EUR">EUR (€) - Euro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label>Invoice Limit</label>
                                    <div className="input-group">
                                        <select name="invoiceLimit" value={formData.invoiceLimit} onChange={handleInputChange}>
                                            <option>10 invoices</option>
                                            <option>Unlimited</option>
                                            <option>Custom</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Additional Invoice Price ($)</label>
                                    <input
                                        type="number"
                                        name="additionalInvoicePrice"
                                        value={formData.additionalInvoicePrice}
                                        onChange={handleInputChange}
                                        placeholder="Price beyond limit"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>User Limit</label>
                                    <select name="userLimit" value={formData.userLimit} onChange={handleInputChange}>
                                        <option>1 user</option>
                                        <option>5 users</option>
                                        <option>Unlimited</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label>Storage Capacity</label>
                                    <select name="storageCapacity" value={formData.storageCapacity} onChange={handleInputChange}>
                                        <option>5 GB</option>
                                        <option>10 GB</option>
                                        <option>100 GB</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Billing Cycle</label>
                                    <select name="billingCycle" value={formData.billingCycle} onChange={handleInputChange}>
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modules */}
                            <div className="form-group modules-section">
                                <label>Modules</label>
                                <div className="modules-grid">
                                    {formData.modules.map((mod, idx) => (
                                        <div key={idx} className="module-item">
                                            <div className="checkbox-wrapper">
                                                <input
                                                    type="checkbox"
                                                    checked={mod.enabled}
                                                    onChange={() => handleModuleToggle(idx)}
                                                />
                                                <span>{mod.name}</span>
                                            </div>
                                            {mod.enabled && (
                                                <div className="price-input-wrapper">
                                                    <span>$</span>
                                                    <input
                                                        type="number"
                                                        value={mod.price}
                                                        onChange={(e) => handleModulePriceChange(idx, e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="total-price-banner">
                                <span>Total Price: <strong>${calculateTotalPrice()}</strong> (Base Price + Selected Modules)</span>
                            </div>

                            {/* Descriptions */}
                            <div className="form-group descriptions-section">
                                <label>Descriptions</label>
                                {formData.descriptions.map((desc, idx) => (
                                    <div key={idx} className="description-row">
                                        <input
                                            type="text"
                                            value={desc}
                                            onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                                            placeholder={`Description ${idx + 1}`}
                                        />
                                        <button className="add-btn-small" onClick={addDescriptionField}>
                                            <Plus size={16} />
                                        </button>
                                        {idx > 0 && (
                                            <button className="remove-btn-small" onClick={() => removeDescriptionField(idx)}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>Close</button>
                            <button className="submit-btn" onClick={handleSubmit}>
                                {isEditMode ? 'Update Plan' : 'Add Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW MODAL --- */}
            {showViewModal && selectedPlan && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>View Plan Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body view-body">
                            <div className="view-row"><strong>Name:</strong> <span>{selectedPlan.name}</span></div>
                            <div className="view-row"><strong>Total Price:</strong> <span>${selectedPlan.totalPrice}</span></div>
                            <div className="view-row"><strong>Billing:</strong> <span>{selectedPlan.billingCycle}</span></div>
                            <div className="view-row"><strong>Modules:</strong>
                                <div className="view-modules">
                                    {selectedPlan.modules?.filter(m => m.enabled).map(m => m.name).join(', ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE MODAL --- */}
            {showDeleteModal && selectedPlan && (
                <div className="modal-overlay">
                    <div className="modal-content modal-sm">
                        <div className="modal-header">
                            <h3>Delete Plan</h3>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{selectedPlan.name}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="delete-confirm-btn" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Plans;
