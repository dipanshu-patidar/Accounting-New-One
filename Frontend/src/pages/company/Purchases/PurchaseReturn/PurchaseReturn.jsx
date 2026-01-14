import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Purchases.css'; // Reusing the shared CSS

const PurchaseReturn = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        returnNo: 'PR-2026-00028WUJ4J',
        vendor: '',
        invoiceNo: '',
        date: '',
        warehouse: '',
        status: 'Pending',
        reason: '',
        manualVoucher: '',
        notes: '',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        ifsc: ''
    });

    const [newItem, setNewItem] = useState({
        product: '',
        qty: 1,
        rate: 0,
        tax: 18,
        total: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = () => {
        setFormData({
            returnNo: 'PR-2026-00028WUJ4J',
            vendor: '',
            invoiceNo: '',
            date: '',
            warehouse: '',
            status: 'Pending',
            reason: '',
            manualVoucher: '',
            notes: '',
            bankName: '',
            accountNumber: '',
            accountHolder: '',
            ifsc: ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setFormData({
            returnNo: item.returnNo,
            vendor: item.vendor,
            invoiceNo: item.invoiceNo,
            date: item.date,
            warehouse: item.warehouse,
            status: item.status,
            reason: 'Damaged Goods', // Dummy data filler
            manualVoucher: '',
            notes: '',
            bankName: '',
            accountNumber: '',
            accountHolder: '',
            ifsc: ''
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleView = (item) => {
        setSelectedReturn(item);
        setShowViewModal(true);
    };

    const handleDelete = (item) => {
        setSelectedReturn(item);
        setShowDeleteModal(true);
    };


    // Dummy Data for visualization
    const returns = [
        {
            id: 1,
            refId: 'REF-001',
            returnNo: 'PR-2024-001',
            invoiceNo: 'BILL-8821',
            vendor: 'Global Suppliers Ltd',
            warehouse: 'Main Warehouse',
            date: '2024-01-20',
            amount: 1200.00,
            status: 'Approved'
        },
        {
            id: 2,
            refId: 'REF-002',
            returnNo: 'PR-2024-002',
            invoiceNo: 'BILL-9901',
            vendor: 'Tech Components Inc',
            warehouse: 'East Branch',
            date: '2024-01-22',
            amount: 450.50,
            status: 'Pending'
        }
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'status-pill active';
            case 'Pending': return 'status-pill pending';
            default: return 'status-pill';
        }
    };

    return (
        <div className="purchase-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-title">Purchase Returns</h1>
                    <p className="page-subtitle">Manage your purchase returns and debit notes</p>
                </div>
                <button className="btn-add" onClick={handleCreate}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Create Return
                </button>
            </div>

            {/* Create Return Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="purchase-form-modal" style={{ maxWidth: '800px', height: 'auto', maxHeight: '90vh' }}>
                        <div className="modal-header-simple">
                            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Purchase Return' : 'Add New Purchase Return'}</h2>
                            <button className="close-btn-simple" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="modal-body-scrollable">
                            {/* Return No */}
                            <div className="form-group mb-4">
                                <label className="form-label-sm">Return No</label>
                                <input
                                    type="text"
                                    className="full-width-input bg-gray-50"
                                    name="returnNo"
                                    value={formData.returnNo}
                                    readOnly
                                />
                            </div>

                            {/* Row 1: Vendor & Invoice */}
                            <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label-sm">Vendor <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="full-width-input"
                                        placeholder="Select or type vendor..."
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="form-label-sm">Invoice <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="full-width-input"
                                        name="invoiceNo"
                                        value={formData.invoiceNo}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Row 2: Date, Warehouse, Status */}
                            <div className="grid grid-cols-3 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label-sm">Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        className="full-width-input"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="form-label-sm">Warehouse <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="full-width-input"
                                        placeholder="Select or type warehouse"
                                        name="warehouse"
                                        value={formData.warehouse}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="form-label-sm">Status</label>
                                    <select
                                        className="full-width-input"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Reason & Manual Voucher */}
                            <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label-sm">Reason for Return</label>
                                    <input
                                        type="text"
                                        className="full-width-input"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="form-label-sm">Manual Voucher No</label>
                                    <input
                                        type="text"
                                        className="full-width-input"
                                        name="manualVoucher"
                                        value={formData.manualVoucher}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-6">
                                <label className="form-label-sm">Notes</label>
                                <textarea
                                    className="full-width-input"
                                    rows="3"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Bank Details */}
                            <div className="mb-6">
                                <h3 className="font-bold text-sm mb-3">Bank Details (Optional)</h3>
                                <div className="grid grid-cols-2 gap-4 mb-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input type="text" className="full-width-input" placeholder="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} />
                                    <input type="text" className="full-width-input" placeholder="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input type="text" className="full-width-input" placeholder="Account Holder" name="accountHolder" value={formData.accountHolder} onChange={handleInputChange} />
                                    <input type="text" className="full-width-input" placeholder="IFSC Code" name="ifsc" value={formData.ifsc} onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* Add Items */}
                            <div className="mb-4">
                                <label className="form-label-sm mb-2">Add Returned Items</label>
                                <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        className="full-width-input"
                                        placeholder="Select or type product"
                                        style={{ flex: 2 }}
                                        name="product"
                                        value={newItem.product}
                                        onChange={handleItemChange}
                                    />
                                    <input type="number" className="full-width-input" placeholder="Qty" style={{ width: '80px' }} name="qty" value={newItem.qty} onChange={handleItemChange} />
                                    <input type="number" className="full-width-input" placeholder="Price" style={{ width: '100px' }} name="rate" value={newItem.rate} onChange={handleItemChange} />
                                    <input type="number" className="full-width-input" placeholder="Tax" style={{ width: '80px' }} name="tax" value={newItem.tax} onChange={handleItemChange} />
                                    <input type="number" className="full-width-input" placeholder="Total" style={{ width: '100px' }} name="total" value={newItem.total} readOnly />
                                    <button className="btn-primary-green" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer-simple">
                            <button className="btn-plain" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary-green">{isEditMode ? 'Update Return' : 'Create Return'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedReturn && (
                <div className="modal-overlay">
                    <div className="purchase-form-modal" style={{ maxWidth: '800px', height: 'auto', maxHeight: '90vh' }}>
                        <div className="modal-header-simple">
                            <h2 className="text-xl font-bold text-gray-800">Purchase Return Details</h2>
                            <button className="close-btn-simple" onClick={() => setShowViewModal(false)}>×</button>
                        </div>
                        <div className="modal-body-scrollable">
                            {/* Detailed Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', fontSize: '14px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Reference ID:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.refId}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Invoice:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.invoiceNo}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Warehouse:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.warehouse}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Amount:</span>
                                        <span style={{ color: '#111827', fontWeight: '600' }}>${selectedReturn.amount.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Reason:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.reason || 'demo'}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Return No:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.returnNo}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Vendor:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.vendor || '—'}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Date:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.date}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Status:</span>
                                        <span className={getStatusClass(selectedReturn.status)} style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'inline-block' }}>{selectedReturn.status}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', color: '#111827', width: '140px', flexShrink: 0 }}>Manual Voucher:</span>
                                        <span style={{ color: '#4b5563' }}>{selectedReturn.manualVoucher || '6'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Notes:</h3>
                                <p style={{ color: '#4b5563', fontSize: '14px' }}>{selectedReturn.notes || 'demo'}</p>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Returned Items</h3>
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                                        <thead style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                            <tr>
                                                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>PRODUCT</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>QTY</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>RATE</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>TAX %</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>DISC</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Dummy Item Row */}
                                            <tr>
                                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', color: '#111827' }}>Book</td>
                                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>100</td>
                                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>₹450</td>
                                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>18%</td>
                                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>₹100</td>
                                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontWeight: '600', color: '#111827' }}>₹53,000</td>
                                            </tr>
                                        </tbody>
                                        <tfoot style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e7eb' }}>
                                            <tr>
                                                <td colSpan="5" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#111827' }}>Grand Total</td>
                                                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#111827' }}>₹53,000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-simple">
                            <button className="btn-primary-green" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedReturn && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-box">
                        <div className="delete-modal-header">
                            <h3 className="delete-modal-title">Delete Return</h3>
                            <button className="delete-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="delete-modal-body">
                            <p>Are you sure you want to delete return <strong>{selectedReturn.returnNo}</strong>?</p>
                            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="delete-modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={() => {
                                console.log('Deleted', selectedReturn.id);
                                setShowDeleteModal(false);
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}


            <div className="table-card">
                {/* Table Header / Controls */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="search-input-wrapper" style={{ width: '300px' }}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search returns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-plain flex items-center gap-2">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                {/* Data Table */}
                <div className="table-container">
                    <table className="purchase-table">
                        <thead>
                            <tr>
                                <th>REF ID</th>
                                <th>RETURN #</th>
                                <th>INVOICE #</th>
                                <th>VENDOR</th>
                                <th>WAREHOUSE</th>
                                <th>DATE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.map((item) => (
                                <tr key={item.id}>
                                    <td className="font-semibold text-gray-700">{item.refId}</td>
                                    <td>
                                        <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                                            {item.returnNo}
                                        </span>
                                    </td>
                                    <td>{item.invoiceNo}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.warehouse}</td>
                                    <td>{item.date}</td>
                                    <td className="font-bold text-gray-700">${item.amount.toFixed(2)}</td>
                                    <td>
                                        <span className={getStatusClass(item.status)}>{item.status}</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action-header" title="View" onClick={() => handleView(item)}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="btn-action-header edit" title="Edit" onClick={() => handleEdit(item)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn-action-header delete" title="Delete" onClick={() => handleDelete(item)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {returns.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            No purchase returns found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseReturn;
