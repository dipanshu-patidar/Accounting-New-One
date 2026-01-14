import React, { useState } from 'react';
import {
    Plus, Search, RotateCcw, Edit, Trash2, ChevronRight, X, Sparkles, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './BankTransfer.css';

const BankTransfer = () => {
    // Mock Data
    const [entries] = useState([
        { id: 1, date: 'Apr 8, 2025', from: 'ROUNDBANK Benjamin Adams', to: '- Cash', amount: '$2,000.00', ref: 'Self', desc: 'Giving information on its origins' },
        { id: 2, date: 'Jul 16, 2025', from: 'COBIZ BANK Chisom Latifat', to: 'US BANK, NA Earl Hane MD', amount: '$500.00', ref: 'Self', desc: 'Giving information on its origins' },
        { id: 3, date: 'Jun 27, 2025', from: 'ROUNDBANK Benjamin Adams', to: 'US BANK, NA Earl Hane MD', amount: '$100.00', ref: 'Self', desc: 'Giving information on its origins' },
        { id: 4, date: 'Aug 9, 2025', from: 'US BANK, NA Earl Hane MD', to: 'COBIZ BANK Chisom Latifat', amount: '$1,000.00', ref: 'Self', desc: 'Giving information on its origins' },
        { id: 5, date: 'Jul 10, 2025', from: 'Caldwell BANK Pearl Reed', to: 'COBIZ BANK Chisom Latifat', amount: '$500.00', ref: 'Self', desc: 'Giving information on its origins' },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const openEdit = (entry) => {
        setSelectedEntry(entry);
        setIsEditOpen(true);
    };

    const openDelete = (entry) => {
        setSelectedEntry(entry);
        setIsDeleteOpen(true);
    };

    return (
        <div className="bank-transfer-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Bank Balance Transfer</h1>
                    <div className="breadcrumb">
                        <Link to="/company/dashboard" className="breadcrumb-link">Dashboard</Link>
                        <ChevronRight size={14} />
                        <span className="breadcrumb-current">Bank Balance Transfer</span>
                    </div>
                </div>
                <button className="btn-success" onClick={() => setIsCreateOpen(true)}>
                    <Plus size={18} />
                </button>
            </div>

            <div className="filter-card">
                <div className="filter-row">
                    <div className="filter-group">
                        <label>Date</label>
                        <input type="date" placeholder="YYYY-MM-DD" />
                    </div>
                    <div className="filter-group">
                        <label>From Account</label>
                        <select defaultValue="">
                            <option value="">Select Account</option>
                            <option>ROUNDBANK Benjamin Adams</option>
                            <option>US BANK, NA Earl Hane MD</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>To Account</label>
                        <select defaultValue="">
                            <option value="">Select Account</option>
                            <option>COBIZ BANK Chisom Latifat</option>
                            <option>- Cash</option>
                        </select>
                    </div>
                    <div className="filter-actions">
                        <button className="btn-search-green">
                            <Search size={18} />
                        </button>
                        <button className="btn-reset-red">
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-controls">
                    <div className="entries-control">
                        <select defaultValue="10">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span>entries per page</span>
                    </div>
                    <div className="search-control">
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>FROM ACCOUNT</th>
                                <th>TO ACCOUNT</th>
                                <th>AMOUNT</th>
                                <th>REFERENCE</th>
                                <th>DESCRIPTION</th>
                                <th className="text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.date}</td>
                                    <td>{row.from}</td>
                                    <td>{row.to}</td>
                                    <td>{row.amount}</td>
                                    <td>{row.ref}</td>
                                    <td>{row.desc}</td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button className="btn-icon edit" onClick={() => openEdit(row)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn-icon delete" onClick={() => openDelete(row)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <span>Showing 1 to 5 of 5 entries</span>
                </div>
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal">
                        <div className="modal-header">
                            <h2>Create Transfer</h2>
                            <button className="close-btn" onClick={() => setIsCreateOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>From Account<span className="required">*</span></label>
                                    <select defaultValue="">
                                        <option value="">- Cash</option>
                                        <option>ROUNDBANK Benjamin Adams</option>
                                    </select>
                                    <div className="helper-text">
                                        Create from account here. <span className="link-text">Create from account</span>
                                    </div>
                                </div>
                                <div className="form-group half">
                                    <label>To Account<span className="required">*</span></label>
                                    <select defaultValue="">
                                        <option value="">- Cash</option>
                                        <option>US BANK, NA Earl Hane MD</option>
                                    </select>
                                    <div className="helper-text">
                                        Create to account here. <span className="link-text">Create to account</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Amount<span className="required">*</span></label>
                                    <input type="text" placeholder="Enter Amount" />
                                </div>
                                <div className="form-group half">
                                    <label>Date<span className="required">*</span></label>
                                    <div className="date-input-wrapper">
                                        <input type="date" placeholder="mm/dd/yyyy" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Reference</label>
                                <input type="text" placeholder="Enter Reference" />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea placeholder="Enter Description" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                            <button className="btn-create">Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal - Same structure as Create */}
            {isEditOpen && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal">
                        <div className="modal-header">
                            <h2>Edit Transfer</h2>
                            <button className="close-btn" onClick={() => setIsEditOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Reusing same form structure for Edit */}
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>From Account<span className="required">*</span></label>
                                    <select defaultValue="ROUNDBANK Benjamin Adams">
                                        <option>ROUNDBANK Benjamin Adams</option>
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label>To Account<span className="required">*</span></label>
                                    <select defaultValue="- Cash">
                                        <option>- Cash</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Amount<span className="required">*</span></label>
                                    <input type="text" defaultValue="$2,000.00" />
                                </div>
                                <div className="form-group half">
                                    <label>Date<span className="required">*</span></label>
                                    <input type="date" defaultValue="2025-04-08" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Reference</label>
                                <input type="text" defaultValue="Self" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea defaultValue="Giving information on its origins" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsEditOpen(false)}>Cancel</button>
                            <button className="btn-create">Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteOpen && (
                <div className="modal-overlay">
                    <div className="modal-content small-modal">
                        <div className="modal-header">
                            <h2>Delete Transfer</h2>
                            <button className="close-btn" onClick={() => setIsDeleteOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this transfer?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                            <button className="btn-delete-confirm">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankTransfer;
