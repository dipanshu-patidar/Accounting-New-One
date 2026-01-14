import React, { useState } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer,
    PackageCheck, Container
} from 'lucide-react';
import './DeliveryChallan.css';

const DeliveryChallan = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [creationMode, setCreationMode] = useState('linked'); // 'direct' or 'linked'
    const [showOrderSelect, setShowOrderSelect] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Edit & Delete State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Header
    const [companyDetails, setCompanyDetails] = useState({
        name: 'Zirak Books',
        address: '123 Business Avenue, Suite 404',
        email: 'info@zirakbooks.com',
        phone: '123-456-7890'
    });

    const [challanMeta, setChallanMeta] = useState({
        manualNo: '',
        date: new Date().toISOString().split('T')[0],
        carrier: '',
        vehicleNo: ''
    });

    // Customer
    const [customer, setCustomer] = useState('');
    const [customerDetails, setCustomerDetails] = useState({
        address: '', // Shipping Address
        email: '',
        phone: ''
    });

    // Items (Linked from Order)
    const [items, setItems] = useState([
        { id: 1, name: '', warehouse: '', ordered: 1, delivered: 1, unit: 'pcs' }
    ]);

    const salesProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'sales-order', label: 'Sales Order', icon: ShoppingCart, status: 'completed' },
        { id: 'delivery', label: 'Delivery', icon: Truck, status: 'active' },
        { id: 'invoice', label: 'Invoice', icon: Receipt, status: 'pending' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    const sampleOrders = [
        {
            id: 'SO-2024-001', customer: 'Acme Corp', date: '2024-01-15', items: [
                { id: 101, name: 'Web Dev Package', warehouse: 'Main', ordered: 1, delivered: 1, unit: 'Pkg' },
                { id: 102, name: 'SEO Setup', warehouse: 'Service', ordered: 1, delivered: 1, unit: 'Service' }
            ]
        }
    ];

    const handleCreationModeToggle = (mode) => {
        setCreationMode(mode);
        if (mode === 'linked') {
            setShowOrderSelect(true);
        } else {
            resetForm();
        }
    };

    const resetForm = () => {
        setSelectedOrder(null);
        setCustomer('');
        setItems([{ id: 1, name: '', warehouse: '', ordered: 0, delivered: 1, unit: 'pcs' }]);
        setChallanMeta({
            manualNo: '',
            date: new Date().toISOString().split('T')[0],
            carrier: '',
            vehicleNo: ''
        });
        setCompanyDetails({
            name: 'Zirak Books',
            address: '123 Business Avenue, Suite 404',
            email: 'info@zirakbooks.com',
            phone: '123-456-7890'
        });
        setIsEditMode(false);
        setEditId(null);
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setCustomer(order.customer);
        // Simulate fetching shipping address
        setCustomerDetails({ address: 'Warehouse 4, Industrial Area', email: 'logistics@acme.com', phone: '555-9999' });
        setItems(order.items.map(item => ({ ...item })));
        setShowOrderSelect(false);
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleEdit = (challanId) => {
        // Reset form first
        resetForm();
        setIsEditMode(true);
        setEditId(challanId);

        // Simulate fetching data for the ID
        setChallanMeta({
            manualNo: 'DC-MAN-EDIT-01',
            date: '2024-01-18',
            carrier: 'FedEx',
            vehicleNo: 'MH-14-GH-4545'
        });
        setCustomer('Acme Corp');
        setCustomerDetails({ address: 'Warehouse 4, Industrial Area', email: 'logistics@acme.com', phone: '555-9999' });
        setItems([
            { id: 101, name: 'Web Dev Package', warehouse: 'Main', ordered: 1, delivered: 1, unit: 'Pkg' }
        ]);

        setShowAddModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Here you would call API to delete
        console.log(`Deleting challan ${deleteId}`);
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    return (
        <div className="delivery-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Delivery Challan</h1>
                    <p className="page-subtitle">Manage product deliveries and shipments</p>
                </div>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} className="mr-2" /> Create Challan
                </button>
            </div>

            <div className="process-tracker-card">
                <div className="tracker-wrapper">
                    {salesProcess.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className={`tracker-step ${step.status}`}>
                                <div className="step-icon-wrapper">
                                    <step.icon size={20} />
                                    {step.status === 'completed' && <CheckCircle2 className="status-badge" size={14} />}
                                    {step.status === 'active' && <Clock className="status-badge" size={14} />}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                            {index < salesProcess.length - 1 && (
                                <div className={`tracker-divider ${salesProcess[index + 1].status !== 'pending' ? 'active' : ''}`}>
                                    <ArrowRight size={16} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="table-card mt-6">
                <div className="table-container">
                    <table className="challan-table">
                        <thead>
                            <tr>
                                <th>CHALLAN ID</th>
                                <th>CUSTOMER</th>
                                <th>LINKED ORDER</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-bold text-blue-600">DC-2024-001</td>
                                <td>Acme Corp</td>
                                <td><span className="source-link">SO-2024-001</span></td>
                                <td>Jan 18, 2024</td>
                                <td><span className="status-pill active">Delivered</span></td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="btn-action-header edit" onClick={() => handleEdit('DC-2024-001')}><Pencil size={16} /></button>
                                        <button className="btn-action-header delete" onClick={() => handleDeleteClick('DC-2024-001')}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Enhanced Create Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content delivery-modal-premium">
                        <div className="modal-header-simple">
                            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Delivery Challan' : 'New Delivery Challan'}</h2>
                            <button className="close-btn-simple" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-scrollable">
                            {/* Mode Selection */}
                            <div className="creation-type-selector mb-6">
                                <button
                                    className={`mode-btn ${creationMode === 'linked' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('linked')}
                                >
                                    From Sales Order
                                </button>
                                <button
                                    className={`mode-btn ${creationMode === 'direct' ? 'active' : ''}`}
                                    onClick={() => handleCreationModeToggle('direct')}
                                >
                                    Direct Delivery
                                </button>
                            </div>

                            {/* Order Selection List (Conditional) */}
                            {creationMode === 'linked' && showOrderSelect && !selectedOrder && (
                                <div className="order-link-container">
                                    <h3 className="text-sm font-bold mb-3 text-gray-700">Select Sales Order</h3>
                                    <div className="order-grid">
                                        {sampleOrders.map(order => (
                                            <div key={order.id} className="order-link-card" onClick={() => handleSelectOrder(order)}>
                                                <div className="o-card-header">
                                                    <span className="o-id">{order.id}</span>
                                                    <span className="o-date">{order.date}</span>
                                                </div>
                                                <div className="o-card-body">
                                                    <span className="o-customer font-bold">{order.customer}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top Section: Company & Document Meta */}
                            <div className="form-section-grid">
                                <div className="company-section">
                                    <div className="logo-upload-box">
                                        <h1 className="company-logo-text">BOOK</h1>
                                    </div>
                                    <div className="company-inputs">
                                        <input type="text" className="full-width-input user-editable"
                                            value={companyDetails.name} onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })} />
                                        <input type="text" className="full-width-input user-editable"
                                            value={companyDetails.address} onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })} />
                                        <input type="text" className="full-width-input user-editable"
                                            value={companyDetails.email} onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })} />
                                    </div>
                                </div>
                                <div className="meta-section">
                                    <div className="meta-row">
                                        <label>Challan No.</label>
                                        <input type="text" value="DC-2024-001" disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Manual Ref</label>
                                        <input type="text" placeholder="e.g. DC-MAN-01"
                                            value={challanMeta.manualNo} onChange={(e) => setChallanMeta({ ...challanMeta, manualNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Date</label>
                                        <input type="date"
                                            value={challanMeta.date} onChange={(e) => setChallanMeta({ ...challanMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Vehicle No</label>
                                        <input type="text"
                                            value={challanMeta.vehicleNo} onChange={(e) => setChallanMeta({ ...challanMeta, vehicleNo: e.target.value })}
                                            className="meta-input" placeholder='MH-12-XX-9999' />
                                    </div>
                                    <div className="status-indicator" style={{ color: '#f59e0b', borderColor: '#f59e0b' }}>
                                        DELIVERY NOTE
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            {/* Customer Section */}
                            <div className="customer-section">
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Ship To</label>
                                    <select
                                        className="form-select-large"
                                        value={customer}
                                        onChange={(e) => setCustomer(e.target.value)}
                                        disabled={creationMode === 'linked'}
                                    >
                                        <option value="">Select Customer...</option>
                                        <option value="Acme Corp">Acme Corp</option>
                                        <option value="Global Tech">Global Tech</option>
                                    </select>
                                </div>
                                <div className="customer-details-grid">
                                    <input type="text" placeholder="Shipping Address" className="detail-input"
                                        value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} />
                                    <input type="tel" placeholder="Contact Phone" className="detail-input"
                                        value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} />
                                </div>
                            </div>

                            {creationMode === 'linked' && selectedOrder && (
                                <div className="linked-indicator mb-6">
                                    <Container size={14} /> Shipping for Order: <strong>{selectedOrder.id}</strong>
                                    <button className="change-link-btn" onClick={() => setShowOrderSelect(true)}>Change</button>
                                </div>
                            )}

                            {/* Items Table */}
                            <div className="items-section-new">
                                <div className="table-responsive">
                                    <table className="new-items-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30%' }}>ITEM NAME</th>
                                                <th style={{ width: '20%' }}>WAREHOUSE</th>
                                                {creationMode === 'linked' && <th style={{ width: '15%' }}>ORDERED</th>}
                                                <th style={{ width: '15%' }}>DELIVERED</th>
                                                <th style={{ width: '10%' }}>UNIT</th>
                                                <th style={{ width: '10%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input type="text" value={item.name} disabled={creationMode === 'linked'}
                                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                            className="full-width-input" />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={item.warehouse}
                                                            onChange={(e) => updateItem(item.id, 'warehouse', e.target.value)}
                                                            className="full-width-input" />
                                                    </td>
                                                    {creationMode === 'linked' && (
                                                        <td>
                                                            <span className="badge-ordered">{item.ordered}</span>
                                                        </td>
                                                    )}
                                                    <td>
                                                        <input type="number" value={item.delivered}
                                                            onChange={(e) => updateItem(item.id, 'delivered', e.target.value)}
                                                            className={`qty-input ${item.delivered > item.ordered ? 'text-red-500' : 'text-green-600'}`} />
                                                    </td>
                                                    <td>
                                                        <span className="text-sm text-gray-500">{item.unit}</span>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="form-footer-grid mt-6">
                                <div className="notes-col">
                                    <label className="section-label">Receiver's Signature</label>
                                    <div className="file-upload-box h-24">
                                        <button className="btn-upload">Upload Signature</button>
                                        <span>No file chosen</span>
                                    </div>
                                </div>
                                <div className="notes-col">
                                    <label className="section-label">Delivery Note / Remarks</label>
                                    <textarea className="notes-area h-24" placeholder="Received in good condition..."></textarea>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer-simple">
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green">{isEditMode ? 'Update Challan' : 'Create Challan'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-modal-content">
                        <div className="delete-modal-header">
                            <h2 className="text-lg font-bold text-red-600">Delete Challan?</h2>
                            <button className="close-btn-simple" onClick={() => setShowDeleteModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="delete-modal-body">
                            <p className="text-gray-600">
                                Are you sure you want to delete this Delivery Challan? This action cannot be undone.
                            </p>
                        </div>
                        <div className="delete-modal-footer">
                            <button className="btn-plain" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryChallan;
