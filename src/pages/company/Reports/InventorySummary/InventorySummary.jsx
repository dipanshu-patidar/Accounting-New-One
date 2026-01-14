import React, { useState } from 'react';
import {
    Search, Filter, Download,
    Eye, X, MapPin, Package, AlertCircle
} from 'lucide-react';
import './InventorySummary.css';

const InventorySummary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Mock Data
    const [inventoryData] = useState([
        {
            id: 1,
            product: 'Wireless Mouse',
            sku: 'WM-001',
            warehouse: 'Main WH',
            opening: 50,
            inward: 20,
            outward: 15,
            closing: 55,
            price: 450.00,
            totalValue: 24750.00,
            status: 'In Stock'
        },
        {
            id: 2,
            product: 'Gaming Keyboard',
            sku: 'GK-102',
            warehouse: 'North WH',
            opening: 10,
            inward: 0,
            outward: 8,
            closing: 2,
            price: 1200.00,
            totalValue: 2400.00,
            status: 'Low Stock'
        },
        {
            id: 3,
            product: 'USB Cable 2m',
            sku: 'USB-202',
            warehouse: 'Main WH',
            opening: 0,
            inward: 0,
            outward: 0,
            closing: 0,
            price: 150.00,
            totalValue: 0.00,
            status: 'Out of Stock'
        }
    ]);

    const handleView = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'In Stock': return 'status-success';
            case 'Low Stock': return 'status-warning';
            case 'Out of Stock': return 'status-danger';
            default: return 'status-neutral';
        }
    };

    return (
        <div className="inventory-summary-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory Summary</h1>
                    <p className="page-subtitle">Track stock movements and current status</p>
                </div>
                <button className="btn-export">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="report-table-card">
                {/* Controls */}
                <div className="table-controls">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by Product or SKU..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="controls-right">
                        <button className="btn-outline"><Filter size={16} /> Filter</button>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Warehouse</th>
                                <th className="text-center">Opening</th>
                                <th className="text-center">Inward</th>
                                <th className="text-center">Outward</th>
                                <th className="text-center">Closing</th>
                                <th className="text-right">Price (₹)</th>
                                <th className="text-right">Total Value (₹)</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryData.map((row, index) => (
                                <tr key={row.id}>
                                    <td>{index + 1}</td>
                                    <td className="font-medium">{row.product}</td>
                                    <td className="font-mono text-sm">{row.sku}</td>
                                    <td>{row.warehouse}</td>
                                    <td className="text-center text-gray-500">{row.opening}</td>
                                    <td className="text-center text-green-600">+{row.inward}</td>
                                    <td className="text-center text-red-500">-{row.outward}</td>
                                    <td className="text-center font-bold">{row.closing}</td>
                                    <td className="text-right">₹{row.price.toFixed(2)}</td>
                                    <td className="text-right font-bold">₹{row.totalValue.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-pill ${getStatusClass(row.status)}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            className="btn-icon-view"
                                            title="View Details"
                                            onClick={() => handleView(row)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {showViewModal && selectedItem && (
                <div className="modal-overlay">
                    <div className="modal-content view-modal">
                        <div className="modal-header">
                            <h2>Inventory Details</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-header">
                                <div className="detail-icon"><Package size={24} /></div>
                                <div>
                                    <h3>{selectedItem.product}</h3>
                                    <span className="sku-tag">{selectedItem.sku}</span>
                                </div>
                                <div className="status-wrapper">
                                    <span className={`status-pill ${getStatusClass(selectedItem.status)}`}>
                                        {selectedItem.status}
                                    </span>
                                </div>
                            </div>

                            <hr className="divider" />

                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>Warehouse</label>
                                    <div className="value flex-center"><MapPin size={14} className="mr-1" /> {selectedItem.warehouse}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Unit Price</label>
                                    <div className="value">₹{selectedItem.price.toFixed(2)}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Total Value</label>
                                    <div className="value font-bold">₹{selectedItem.totalValue.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="stock-movement-card">
                                <h4>Stock Movement</h4>
                                <div className="movement-stats">
                                    <div className="stat-box">
                                        <span className="stat-label">Opening</span>
                                        <span className="stat-value text-gray-500">{selectedItem.opening}</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-label">Inward</span>
                                        <span className="stat-value text-green-600">+{selectedItem.inward}</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-label">Outward</span>
                                        <span className="stat-value text-red-500">-{selectedItem.outward}</span>
                                    </div>
                                    <div className="stat-box closing">
                                        <span className="stat-label">Closing</span>
                                        <span className="stat-value">{selectedItem.closing}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventorySummary;
