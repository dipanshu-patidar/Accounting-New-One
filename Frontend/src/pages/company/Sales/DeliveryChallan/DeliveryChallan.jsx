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

    const [customer, setCustomer] = useState('');
    const [items, setItems] = useState([{ id: 1, name: '', qty: 1, orderedQty: 1, rate: 0, total: 0 }]);
    const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);

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
                { id: 101, name: 'Web Dev Package', qty: 1, rate: 3000, total: 3000 },
                { id: 102, name: 'SEO Setup', qty: 1, rate: 1000, total: 1000 }
            ]
        },
        {
            id: 'SO-2024-002', customer: 'Global Tech', date: '2024-01-18', items: [
                { id: 103, name: 'Cloud Server (Monthly)', qty: 12, rate: 200, total: 2400 }
            ]
        }
    ];

    const handleCreationModeToggle = (mode) => {
        setCreationMode(mode);
        if (mode === 'linked') {
            setShowOrderSelect(true);
        } else {
            setSelectedOrder(null);
            setCustomer('');
            setItems([{ id: 1, name: '', qty: 1, orderedQty: 1, rate: 0, total: 0 }]);
        }
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setCustomer(order.customer);
        // Map items, keeping track of ordered qty vs delivery qty
        setItems(order.items.map(item => ({
            ...item,
            orderedQty: item.qty // Keep original ordered qty for reference
        })));
        setShowOrderSelect(false);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', qty: 1, orderedQty: 0, rate: 0, total: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                // Ensure delivery qty doesn't exceed ordered qty if linked (optional, but good practice)
                // For now, we just update total
                return updatedItem;
            }
            return item;
        }));
    };

    return (
        <div className="delivery-page">
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Delivery Challan</h1>
                    <p className="page-subtitle">Manage product deliveries and shipments</p>
                </div>
                <div className="header-actions">
                    <button className="btn-add" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} className="mr-2" /> New Delivery
                    </button>
                </div>
            </div>

            {/* Sales Process Tracker */}
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
                <div className="table-controls">
                    <div className="search-control">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search challans..." className="search-input" />
                    </div>
                </div>

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
                                        <button className="btn-icon-edit"><Pencil size={16} /></button>
                                        <button className="btn-icon-delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Delivery Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content delivery-modal">
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Create Delivery Challan</h2>
                                <p className="modal-subtitle">Generate delivery note from Sales Order</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
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
                                    <h3 className="text-sm font-bold mb-3 text-gray-700">Select Sales Order to Deliver</h3>
                                    <div className="order-grid">
                                        {sampleOrders.map(order => (
                                            <div key={order.id} className="order-link-card" onClick={() => handleSelectOrder(order)}>
                                                <div className="o-card-header">
                                                    <span className="o-id">{order.id}</span>
                                                    <span className="o-date">{order.date}</span>
                                                </div>
                                                <div className="o-card-body">
                                                    <span className="o-customer">{order.customer}</span>
                                                    <span className="o-items">{order.items.length} Items</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-container">
                                {/* Company Info - Read Only */}
                                <div className="company-info-readonly mb-6">
                                    <div className="company-brand">
                                        <div className="logo-placeholder">ZB</div>
                                        <div className="brand-details">
                                            <h4>Zirak Books</h4>
                                            <p>123 Business Avenue, Suite 404</p>
                                        </div>
                                    </div>
                                    <div className="company-meta">
                                        <p><strong>GSTIN:</strong> 27AAPCM0314L1Z3</p>
                                        <p><strong>Dispatch From:</strong> Main Warehouse</p>
                                    </div>
                                </div>

                                <div className="form-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">Customer Name</label>
                                        <select
                                            className="form-input"
                                            value={customer}
                                            onChange={(e) => setCustomer(e.target.value)}
                                            disabled={creationMode === 'linked'}
                                        >
                                            <option value="">Select Customer</option>
                                            <option value="Acme Corp">Acme Corp</option>
                                            <option value="Global Tech">Global Tech</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Challan Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={challanDate}
                                            onChange={(e) => setChallanDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Carrier / Vehicle No</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. MH-12-AB-1234"
                                        />
                                    </div>
                                </div>

                                {creationMode === 'linked' && selectedOrder && (
                                    <div className="linked-indicator mb-4">
                                        <Container size={14} /> Delivering for <strong>{selectedOrder.id}</strong>
                                        <button className="change-link-btn" onClick={() => setShowOrderSelect(true)}>Change</button>
                                    </div>
                                )}

                                {/* Items Table */}
                                <div className="items-section mt-4">
                                    <div className="section-header">
                                        <h3 className="section-title">Items to Deliver</h3>
                                        {creationMode === 'direct' && (
                                            <button className="btn-add-sm" onClick={addItem}>
                                                <Plus size={14} /> Add Item
                                            </button>
                                        )}
                                    </div>

                                    <div className="items-table-wrapper">
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Product / Service</th>
                                                    {creationMode === 'linked' && <th style={{ width: '100px' }}>Ordered</th>}
                                                    <th style={{ width: '120px' }}>Delivered Qty</th>
                                                    <th>Unit</th>
                                                    <th style={{ width: '50px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="table-input"
                                                                value={item.name}
                                                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                                disabled={creationMode === 'linked'}
                                                                placeholder="Enter product name"
                                                            />
                                                        </td>
                                                        {creationMode === 'linked' && (
                                                            <td>
                                                                <span className="badge-ordered">{item.orderedQty}</span>
                                                            </td>
                                                        )}
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className={`table-input font-bold ${item.qty > item.orderedQty && creationMode === 'linked' ? 'text-red-600' : 'text-green-600'}`}
                                                                value={item.qty}
                                                                onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="text-gray-500 text-sm">Units</td>
                                                        <td>
                                                            {creationMode === 'direct' && (
                                                                <button className="btn-remove" onClick={() => removeItem(item.id)}>
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Delivery Note Summary */}
                                <div className="order-summary mt-8">
                                    <div className="summary-col w-full">
                                        <div className="form-group">
                                            <label className="form-label">Delivery Note / Remarks</label>
                                            <textarea className="form-textarea" placeholder="Goods received in good condition..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="footer-left">
                                <button className="btn-secondary">
                                    <Printer size={16} /> Print Challan
                                </button>
                            </div>
                            <div className="footer-right">
                                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn-submit" style={{ backgroundColor: '#8ce043' }}>Create Challan</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryChallan;
