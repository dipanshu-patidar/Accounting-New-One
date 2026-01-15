import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, ChevronDown,
    FileText, ShoppingCart, Truck, Receipt, CreditCard,
    CheckCircle2, Clock, ArrowRight, Download, Send, Printer,
    Eye, Copy, ArrowLeft, AlertTriangle
} from 'lucide-react';
import './Invoice.css';
import salesInvoiceService from '../../../../services/salesInvoiceService';
import customerService from '../../../../services/customerService';
import productService from '../../../../services/productService';
import serviceService from '../../../../services/serviceService';
import warehouseService from '../../../../services/warehouseService';

const Invoice = () => {
    // --- State Management ---
    const [invoices, setInvoices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // View Request State
    const [viewMode, setViewMode] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    // Header & Meta
    const [companyDetails, setCompanyDetails] = useState({
        name: 'Zirak Books',
        address: '123 Business Avenue, Suite 404',
        email: 'info@zirakbooks.com',
        phone: '123-456-7890'
    });

    const [invoiceMeta, setInvoiceMeta] = useState({
        manualNo: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: ''
    });

    // Customer
    const [customer, setCustomer] = useState('');
    const [customerDetails, setCustomerDetails] = useState({
        address: '',
        email: '',
        phone: ''
    });

    // Items
    const [items, setItems] = useState([
        { id: 1, name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }
    ]);

    // Footer
    const [bankDetails, setBankDetails] = useState({
        bankName: 'HDFC Bank',
        accNo: '50200012345678',
        holderName: 'Zirak Trading Pvt Ltd',
        ifsc: 'HDFC0000456'
    });

    const [notes, setNotes] = useState('');
    const [terms, setTerms] = useState('"Payment is due within 15 days.",\n"Late payments are subject to interest."');

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [invoicesRes, customersRes, productsRes, servicesRes, warehousesRes] = await Promise.all([
                salesInvoiceService.getInvoices(),
                customerService.getCustomers(),
                productService.getProducts(),
                serviceService.getServices(),
                warehouseService.getWarehouses()
            ]);
            setInvoices(invoicesRes);
            setCustomers(customersRes);
            setProducts(productsRes);
            setServices(servicesRes);
            setWarehouses(warehousesRes);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const salesProcess = [
        { id: 'quotation', label: 'Quotation', icon: FileText, status: 'completed' },
        { id: 'sales-order', label: 'Sales Order', icon: ShoppingCart, status: 'completed' },
        { id: 'delivery', label: 'Delivery', icon: Truck, status: 'completed' },
        { id: 'invoice', label: 'Invoice', icon: Receipt, status: 'active' },
        { id: 'payment', label: 'Payment', icon: CreditCard, status: 'pending' },
    ];

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }]);
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
                if (['qty', 'rate', 'tax', 'discount'].includes(field)) {
                    const qty = parseFloat(updatedItem.qty) || 0;
                    const rate = parseFloat(updatedItem.rate) || 0;
                    const tax = parseFloat(updatedItem.tax) || 0;
                    const discount = parseFloat(updatedItem.discount) || 0;

                    const subtotal = qty * rate;
                    const taxable = subtotal - discount;
                    const taxAmount = (taxable * tax) / 100;

                    updatedItem.total = taxable + taxAmount;
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const calculateTotals = () => {
        return items.reduce((acc, item) => {
            const qty = parseFloat(item.qty) || 0;
            const rate = parseFloat(item.rate) || 0;
            const discount = parseFloat(item.discount) || 0;
            const subtotal = qty * rate;

            acc.subTotal += subtotal;
            acc.discount += discount;
            acc.total += item.total;
            acc.tax += (item.total - (subtotal - discount));
            return acc;
        }, { subTotal: 0, tax: 0, discount: 0, total: 0 });
    };

    const totals = calculateTotals();

    // Helper to get status class
    const getStatusClass = (status) => {
        switch (status) {
            case 'PARTIALLY_PAID': return 'partial';
            case 'PAID': return 'paid';
            case 'SENT': return 'sent';
            case 'OVERDUE': return 'overdue';
            case 'DRAFT': return 'draft';
            case 'CANCELLED': return 'cancelled';
            default: return 'pending';
        }
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    // --- Actions Handlers ---

    const handleView = async (invoice) => {
        try {
            const fullDetails = await salesInvoiceService.getInvoice(invoice.id);
            setSelectedInvoice(fullDetails);
            setViewMode(true);
        } catch (err) {
            console.error('Error fetching invoice details:', err);
            setError('Failed to load invoice details');
        }
    };

    const handleDelete = (invoice) => {
        setInvoiceToDelete(invoice);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (invoiceToDelete) {
            try {
                await salesInvoiceService.deleteInvoice(invoiceToDelete.id);
                setInvoices(invoices.filter(inv => inv.id !== invoiceToDelete.id));
                setShowDeleteModal(false);
                setInvoiceToDelete(null);
                if (viewMode) setViewMode(false);
            } catch (err) {
                console.error('Error deleting invoice:', err);
                setError(err.response?.data?.message || 'Failed to delete invoice');
            }
        }
    };

    const handleCreateInvoice = async () => {
        try {
            const invoiceData = {
                customerId: parseInt(customer),
                invoiceDate: invoiceMeta.date,
                dueDate: invoiceMeta.dueDate,
                referenceNumber: invoiceMeta.manualNo,
                billingAddress: customerDetails.address,
                notes,
                terms,
                items: items.map(item => ({
                    productId: item.productId || null,
                    serviceId: item.serviceId || null,
                    warehouseId: item.warehouseId || null,
                    description: item.name,
                    quantity: parseFloat(item.qty) || 1,
                    unitPrice: parseFloat(item.rate) || 0,
                    taxPercent: parseFloat(item.tax) || 0,
                    discountPercent: parseFloat(item.discount) || 0
                }))
            };
            await salesInvoiceService.createInvoice(invoiceData);
            setShowAddModal(false);
            fetchData();
            resetForm();
        } catch (err) {
            console.error('Error creating invoice:', err);
            setError(err.response?.data?.message || 'Failed to create invoice');
        }
    };

    const handleSendInvoice = async (invoiceId) => {
        try {
            await salesInvoiceService.sendInvoice(invoiceId);
            fetchData();
        } catch (err) {
            console.error('Error sending invoice:', err);
            setError(err.response?.data?.message || 'Failed to send invoice');
        }
    };

    const resetForm = () => {
        setCustomer('');
        setCustomerDetails({ address: '', email: '', phone: '' });
        setItems([{ id: 1, name: '', warehouse: '', qty: 1, rate: 0, tax: 0, discount: 0, total: 0 }]);
        setInvoiceMeta({ manualNo: '', date: new Date().toISOString().split('T')[0], dueDate: '' });
        setNotes('');
        setTerms('"Payment is due within 15 days.",\n"Late payments are subject to interest."');
    };

    const handleEdit = (invoice) => {
        // Pre-fill logic would go here. For now, populating with sample data
        setCustomer(invoice.customer);
        setInvoiceMeta({ ...invoiceMeta, manualNo: invoice.invoiceNo });
        setShowEditModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    // --- RENDER FULL PAGE VIEW IF IN VIEW MODE ---
    if (viewMode && selectedInvoice) {
        return (
            <div className="invoice-full-page-view">
                <div className="view-page-header no-print">
                    <button className="btn-back" onClick={() => setViewMode(false)}>
                        <ArrowLeft size={18} /> Back to Invoices
                    </button>
                    <div className="view-actions">
                        <button className="btn-print" onClick={handlePrint}>
                            <Printer size={18} /> Print
                        </button>
                    </div>
                </div>

                <div className="view-content-wrapper printable-area">
                    {/* Header */}
                    <div className="view-doc-header">
                        <div className="doc-title-row">
                            <h1 className="doc-main-title">Invoice</h1>
                            <span className="doc-number">{selectedInvoice.invoiceNo}</span>
                        </div>
                        <div className="view-dates-row">
                            <div className="date-group">
                                <span className="date-label">Issue Date:</span>
                                <span className="date-val">{selectedInvoice.issueDate}</span>
                            </div>
                            <div className="date-group">
                                <span className="date-label">Due Date:</span>
                                <span className="date-val">{selectedInvoice.dueDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="view-address-grid">
                        <div className="addr-col">
                            <h4 className="addr-title">Billed To:</h4>
                            <p className="addr-name">{selectedInvoice.billedTo.name}</p>
                            <p className="addr-text">{selectedInvoice.billedTo.address}</p>
                            <p className="addr-text">{selectedInvoice.billedTo.city}</p>
                            <p className="addr-text">{selectedInvoice.billedTo.country}</p>
                            <p className="addr-text mt-2">{selectedInvoice.billedTo.phone}</p>
                            <p className="addr-text">Tax Number: {selectedInvoice.billedTo.taxNo}</p>
                            <p className="addr-text">GST Number : {selectedInvoice.billedTo.gstNo}</p>
                        </div>
                        <div className="addr-col">
                            <h4 className="addr-title">Shipped To:</h4>
                            <p className="addr-name">{selectedInvoice.shippedTo.name}</p>
                            <p className="addr-text">{selectedInvoice.shippedTo.address}</p>
                            <p className="addr-text">{selectedInvoice.shippedTo.city}</p>
                            <p className="addr-text">{selectedInvoice.shippedTo.country}</p>
                            <p className="addr-text mt-2">{selectedInvoice.shippedTo.phone}</p>
                            <p className="addr-text">Tax Number: {selectedInvoice.shippedTo.taxNo}</p>
                        </div>
                        <div className="qr-col">
                            <div className="qr-placeholder">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=InvoiceDemo" alt="QR Code" />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="view-status-row">
                        <span className="view-status-label">Status :</span>
                        <span className={`status-pill ${getStatusClass(selectedInvoice.status)}`}>{selectedInvoice.status}</span>
                    </div>

                    {/* Product Summary */}
                    <h3 className="product-summary-title">Product Summary</h3>
                    <p className="product-summary-subtitle">All items here cannot be deleted.</p>

                    {/* Table */}
                    <div className="view-table-container">
                        <table className="view-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Rate</th>
                                    <th>Discount</th>
                                    <th>Tax</th>
                                    <th>Description</th>
                                    <th className="text-right">
                                        Price
                                        <span className="sub-header-red">before tax & discount</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInvoice.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td className="font-medium text-blue-600">{item.name}</td>
                                        <td>{item.qty} ({item.unit})</td>
                                        <td>${item.rate.toFixed(2)}</td>
                                        <td>${item.discount.toFixed(2)}</td>
                                        <td>
                                            <div className="tax-breakdown">
                                                <div className="tax-row"><span>CGST (5.5%)</span> <span>${(item.tax / 2).toFixed(2)}</span></div>
                                                <div className="tax-row"><span>SGST (5.5%)</span> <span>${(item.tax / 2).toFixed(2)}</span></div>
                                            </div>
                                        </td>
                                        <td>{item.description}</td>
                                        <td className="text-right font-medium">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="view-table-total-row">
                                    <td colSpan="2" className="font-bold">Total</td>
                                    <td className="font-bold">1</td>
                                    <td className="font-bold">$150.00</td>
                                    <td className="font-bold">$0.00</td>
                                    <td className="font-bold">$16.50</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Totals */}
                    <div className="view-footer-totals">
                        <div className="vf-row"><span>Sub Total</span> <span>${selectedInvoice.subTotal.toFixed(2)}</span></div>
                        <div className="vf-row"><span>Discount</span> <span>${selectedInvoice.discountTotal.toFixed(2)}</span></div>
                        <div className="vf-row"><span>CGST</span> <span>${selectedInvoice.cgst.toFixed(2)}</span></div>
                        <div className="vf-row"><span>SGST</span> <span>${selectedInvoice.sgst.toFixed(2)}</span></div>
                        <div className="vf-row total"><span>Total</span> <span>${selectedInvoice.totalAmount.toFixed(2)}</span></div>
                        <div className="vf-row"><span>Paid</span> <span>${selectedInvoice.paidAmount.toFixed(2)}</span></div>
                        <div className="vf-row"><span>Credit Note</span> <span>${selectedInvoice.creditNote.toFixed(2)}</span></div>
                        <div className="vf-row due"><span>Due</span> <span>${selectedInvoice.dueAmount.toFixed(2)}</span></div>
                    </div>
                </div>

                {/* Edit Modal Logic - reusing the component rendering below but conditionally */}
                {showEditModal && (
                    <div className="modal-overlay">
                        <div className="modal-content invoice-form-modal">
                            <div className="modal-header-simple">
                                <h2 className="text-xl font-bold text-gray-800">Edit Invoice</h2>
                                <button className="close-btn-simple" onClick={() => setShowEditModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="modal-body-scrollable">
                                <div className="form-section-grid">
                                    <div className="company-section">
                                        <div className="logo-upload-box"><h1 className="company-logo-text">BOOK</h1></div>
                                        <div className="company-inputs">
                                            <input type="text" className="full-width-input user-editable" value={companyDetails.name} onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })} />
                                            <input type="text" className="full-width-input user-editable" value={companyDetails.address} onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })} />
                                            <input type="text" className="full-width-input user-editable" value={companyDetails.email} onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })} />
                                            <input type="text" className="full-width-input user-editable" value={companyDetails.phone} onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="meta-section">
                                        <div className="meta-row"><label>Invoice No.</label><input type="text" value={invoiceMeta.manualNo || "INV-001"} disabled className="meta-input disabled" /></div>
                                        {/* ... meta rows usually distinct ... */}
                                    </div>
                                </div>
                                <hr className="divider" />
                                <div className="customer-section">
                                    <div className="form-group mb-2">
                                        <label className="form-label-sm">Bill To</label>
                                        <select className="form-select-large" value={customer} onChange={(e) => setCustomer(e.target.value)}>
                                            <option value="">Select Customer...</option>
                                            <option value={customer || "Default"}>{customer || "Acme Corp"}</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Items Table - Simplified reuse */}
                                <div className="items-section-new">
                                    <button className="btn-add-row" onClick={addItem}>
                                        <Plus size={14} /> Add Line Item
                                    </button>
                                    <div className="table-responsive">
                                        <table className="new-items-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '25%' }}>ITEM DETAIL</th>
                                                    <th style={{ width: '15%' }}>WAREHOUSE</th>
                                                    <th style={{ width: '10%' }}>QTY</th>
                                                    <th style={{ width: '12%' }}>RATE</th>
                                                    <th style={{ width: '10%' }}>TAX %</th>
                                                    <th style={{ width: '10%' }}>DISC.</th>
                                                    <th style={{ width: '12%' }}>AMOUNT</th>
                                                    <th style={{ width: '6%' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Reuse items state */}
                                                {items.map(item => (
                                                    <tr key={item.id}>
                                                        <td><input type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} /></td>
                                                        {/* ... just placeholders for functional demo ... */}
                                                        <td colSpan="7" className="text-center text-gray-400">... (Editable Items) ...</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer-simple">
                                <button className="btn-plain" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="btn-primary-green" onClick={() => setShowEditModal(false)}>Update Invoice</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="confirmation-modal">
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
                                <AlertTriangle size={48} />
                            </div>
                            <h3>Delete Invoice?</h3>
                            <p>Are you sure you want to delete this invoice? This action cannot be undone.</p>
                            <div className="confirmation-actions">
                                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- DEFAULT RENDER (LIST) ---
    return (
        <div className="invoice-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Invoices</h1>
                    <p className="page-subtitle">Manage billing and payments</p>
                </div>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} className="mr-2" /> CREATE INVOICE
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
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>INVOICE</th>
                                <th>CUSTOMER</th>
                                <th>ISSUE DATE</th>
                                <th>DUE DATE</th>
                                <th>AMOUNT DUE</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4">No invoices found</td></tr>
                            ) : invoices.map(inv => (
                                <tr key={inv.id}>
                                    <td>
                                        <span className="invoice-badge cursor-pointer" onClick={() => handleView(inv)}>{inv.invoiceNumber}</span>
                                    </td>
                                    <td className="font-medium">{inv.customer?.name || 'N/A'}</td>
                                    <td>{formatDate(inv.invoiceDate)}</td>
                                    <td>
                                        <span className="text-red-highlight">{formatDate(inv.dueDate)}</span>
                                    </td>
                                    <td>
                                        <span className="text-amount-bold">${inv.dueAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${getStatusClass(inv.status)}`}>
                                            {formatStatus(inv.status)}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-icon-view" title="View" onClick={() => handleView(inv)}><Eye size={16} /></button>
                                            {inv.status === 'DRAFT' && (
                                                <button className="btn-action-header send" title="Send Invoice" onClick={() => handleSendInvoice(inv.id)}>
                                                    <Send size={18} />
                                                </button>
                                            )}
                                            <button className="btn-action-header edit" title="Edit Invoice" onClick={() => handleEdit(inv)}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="btn-action-header delete" title="Delete Invoice" onClick={() => handleDelete(inv)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Create Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content invoice-form-modal">
                        <div className="modal-header-simple">
                            <h2 className="text-xl font-bold text-gray-800">New Invoice</h2>
                            <button className="close-btn-simple" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body-scrollable">
                            {/* ... (Existing Create Modal Content) ... */}
                            {/* Top Section */}
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
                                        <input type="text" className="full-width-input user-editable"
                                            value={companyDetails.phone} onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="meta-section">
                                    <div className="meta-row">
                                        <label>Invoice No.</label>
                                        <input type="text" value="INV-2024-001" disabled className="meta-input disabled" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Manual Ref</label>
                                        <input type="text" placeholder="e.g. PO-REF-001"
                                            value={invoiceMeta.manualNo} onChange={(e) => setInvoiceMeta({ ...invoiceMeta, manualNo: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Date</label>
                                        <input type="date"
                                            value={invoiceMeta.date} onChange={(e) => setInvoiceMeta({ ...invoiceMeta, date: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="meta-row">
                                        <label>Due Date</label>
                                        <input type="date"
                                            value={invoiceMeta.dueDate} onChange={(e) => setInvoiceMeta({ ...invoiceMeta, dueDate: e.target.value })}
                                            className="meta-input" />
                                    </div>
                                    <div className="status-indicator" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                                        UNPAID
                                    </div>
                                </div>
                            </div>
                            <hr className="divider" />
                            {/* Customer Section */}
                            <div className="customer-section">
                                <div className="form-group mb-2">
                                    <label className="form-label-sm">Bill To</label>
                                    <select className="form-select-large" value={customer} onChange={(e) => {
                                        setCustomer(e.target.value);
                                        const selectedCustomer = customers.find(c => c.id === parseInt(e.target.value));
                                        if (selectedCustomer) {
                                            setCustomerDetails({
                                                address: selectedCustomer.address || '',
                                                email: selectedCustomer.email || '',
                                                phone: selectedCustomer.phone || ''
                                            });
                                        }
                                    }}>
                                        <option value="">Select Customer...</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="customer-details-grid">
                                    <input type="text" placeholder="Billing Address" className="detail-input"
                                        value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} />
                                    <input type="email" placeholder="Email Address" className="detail-input"
                                        value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} />
                                    <input type="tel" placeholder="Phone Number" className="detail-input"
                                        value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} />
                                </div>
                            </div>
                            {/* Items Table */}
                            <div className="items-section-new">
                                <button className="btn-add-row" onClick={addItem}>
                                    <Plus size={14} /> Add Line Item
                                </button>
                                <div className="table-responsive">
                                    <table className="new-items-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '25%' }}>ITEM DETAIL</th>
                                                <th style={{ width: '15%' }}>WAREHOUSE</th>
                                                <th style={{ width: '10%' }}>QTY</th>
                                                <th style={{ width: '12%' }}>RATE</th>
                                                <th style={{ width: '10%' }}>TAX %</th>
                                                <th style={{ width: '10%' }}>DISC.</th>
                                                <th style={{ width: '12%' }}>AMOUNT</th>
                                                <th style={{ width: '6%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="search-input-wrapper">
                                                            <input type="text" placeholder="Search Item..."
                                                                value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                                                            <Search size={14} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input type="text" placeholder="Main Warehouse"
                                                            value={item.warehouse} onChange={(e) => updateItem(item.id, 'warehouse', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="qty-input" value={item.qty}
                                                            onChange={(e) => updateItem(item.id, 'qty', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="rate-input" value={item.rate}
                                                            onChange={(e) => updateItem(item.id, 'rate', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="tax-input" value={item.tax}
                                                            onChange={(e) => updateItem(item.id, 'tax', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="discount-input" value={item.discount}
                                                            onChange={(e) => updateItem(item.id, 'discount', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="amount-input disabled" value={item.total.toFixed(2)} disabled />
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn-delete-row" onClick={() => removeItem(item.id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Totals Section */}
                            <div className="totals-layout">
                                <div className="totals-spacer"></div>
                                <div className="totals-box">
                                    <div className="t-row">
                                        <span>Sub Total:</span>
                                        <span>${totals.subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="t-row">
                                        <span>Discount:</span>
                                        <span className="text-red-500">-${totals.discount.toFixed(2)}</span>
                                    </div>
                                    <div className="t-row">
                                        <span>Tax Total:</span>
                                        <span>${totals.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="t-row total">
                                        <span>Grand Total:</span>
                                        <span>${totals.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Footer Grid */}
                            <div className="form-footer-grid">
                                <div className="bank-terms-col">
                                    <label className="section-label">Bank Details</label>
                                    <div className="bank-details-box">
                                        <input type="text" className="bank-input" placeholder="Bank Name" value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} />
                                        <input type="text" className="bank-input" placeholder="Account No" value={bankDetails.accNo} onChange={(e) => setBankDetails({ ...bankDetails, accNo: e.target.value })} />
                                        <input type="text" className="bank-input" placeholder="Account Holder" value={bankDetails.holderName} onChange={(e) => setBankDetails({ ...bankDetails, holderName: e.target.value })} />
                                        <input type="text" className="bank-input" placeholder="IFSC / Swift" value={bankDetails.ifsc} onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })} />
                                    </div>
                                    <div className="mt-4">
                                        <label className="section-label">Attachments</label>
                                        <div className="attachments-row">
                                            <button className="btn-upload-small">
                                                <span className="icon">📷</span> Photos
                                            </button>
                                            <button className="btn-upload-small">
                                                <span className="icon">📎</span> Files
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="notes-col">
                                    <label className="section-label">Notes</label>
                                    <textarea className="notes-area" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="terms-section mt-4">
                                <label className="section-label">Terms & Conditions</label>
                                <textarea className="terms-area" value={terms} onChange={(e) => setTerms(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer-simple">
                            <button className="btn-plain" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={handleCreateInvoice}>Generate Invoice</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal (Duplicated Structure) */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content invoice-form-modal">
                        <div className="modal-header-simple">
                            <h2 className="text-xl font-bold text-gray-800">Edit Invoice</h2>
                            <button className="close-btn-simple" onClick={() => setShowEditModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body-scrollable">
                            {/* Content Duplicated for Display Purpose - In real app, refactor to component */}
                            {/* For this specific task request (open edit modal), reusing layout */}
                            <div className="form-section-grid">
                                <div className="company-section">
                                    <div className="logo-upload-box"><h1 className="company-logo-text">BOOK</h1></div>
                                    <div className="company-inputs">
                                        <input type="text" className="full-width-input user-editable" value={companyDetails.name} onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })} />
                                        <input type="text" className="full-width-input user-editable" value={companyDetails.address} onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })} />
                                        {/*...*/}
                                    </div>
                                </div>
                                <div className="meta-section">
                                    <div className="meta-row"><label>Invoice No.</label><input type="text" value={invoiceMeta.manualNo} disabled className="meta-input disabled" /></div>
                                    {/*...*/}
                                </div>
                            </div>
                            {/* Customer Section */}
                            <div className="customer-section">
                                <div className="form-group mb-2"><label className="form-label-sm">Bill To</label><select className="form-select-large" value={customer} onChange={(e) => setCustomer(e.target.value)}><option value="">Select Customer...</option><option value="Acme Corp">Acme Corp</option></select></div>
                            </div>
                            {/* Items Section */}
                            <div className="items-section-new">
                                <button className="btn-add-row" onClick={addItem}><Plus size={14} /> Add Line Item</button>
                                <div className="table-responsive">
                                    <table className="new-items-table"><thead><tr><th style={{ width: '25%' }}>ITEM DETAIL</th><th>...</th></tr></thead><tbody>{items.map(item => (<tr key={item.id}><td><input type="text" value={item.name} /></td><td>...</td></tr>))}</tbody></table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-simple">
                            <button className="btn-plain" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-primary-green" onClick={() => setShowEditModal(false)}>Update Invoice</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="confirmation-modal">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
                            <AlertTriangle size={48} />
                        </div>
                        <h3>Delete Invoice?</h3>
                        <p>Are you sure you want to delete this invoice? This action cannot be undone.</p>
                        <div className="confirmation-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoice;
