import React, { useState } from 'react';
import { Search, Eye, X } from 'lucide-react';
import './Transactions.css';

const Transactions = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const transactions = [
        {
            id: 1,
            date: '2026-01-13',
            transactionId: 'TXN00001',
            balanceType: 'Debit',
            voucherType: 'Sales Invoice',
            voucherNo: 'INV00001',
            amount: '1,200.00',
            fromTo: 'Anthony B Renfroe',
            accountType: 'Debtors',
            note: 'Monthly sales'
        },
        {
            id: 2,
            date: '2026-01-12',
            transactionId: 'TXN00002',
            balanceType: 'Credit',
            voucherType: 'Purchase Bill',
            voucherNo: 'BILL00001',
            amount: '850.00',
            fromTo: 'Kim J Gibson',
            accountType: 'Creditors',
            note: 'Office supplies'
        },
        {
            id: 3,
            date: '2026-01-11',
            transactionId: 'TXN00003',
            balanceType: 'Debit',
            voucherType: 'Payment',
            voucherNo: 'PAY00001',
            amount: '500.00',
            fromTo: 'Cash in Hand',
            accountType: 'Asset',
            note: 'Initial deposit'
        }
    ];

    const handleView = (txn) => {
        setSelectedTransaction(txn);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    return (
        <div className="transactions-page">
            <div className="page-header">
                <h1 className="page-title">All Transactions</h1>
            </div>

            <div className="transactions-card">
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

                <div className="table-responsive">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>DATE</th>
                                <th>TRANSACTION ID</th>
                                <th>BALANCE TYPE</th>
                                <th>VOUCHER TYPE</th>
                                <th>VOUCHER NO</th>
                                <th>AMOUNT</th>
                                <th>FROM/TO</th>
                                <th>ACCOUNT TYPE</th>
                                <th>NOTE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => (
                                <tr key={txn.id}>
                                    <td>{index + 1}</td>
                                    <td>{txn.date}</td>
                                    <td>{txn.transactionId}</td>
                                    <td>{txn.balanceType}</td>
                                    <td>{txn.voucherType}</td>
                                    <td>
                                        <div className="voucher-badge">
                                            #{txn.voucherNo}
                                        </div>
                                    </td>
                                    <td className={txn.balanceType === 'Debit' ? 'text-success' : 'text-danger'}>
                                        ${txn.amount}
                                    </td>
                                    <td>{txn.fromTo}</td>
                                    <td>{txn.accountType}</td>
                                    <td className="note-cell">{txn.note}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn btn-view"
                                                data-tooltip="View"
                                                onClick={() => handleView(txn)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-row">
                    <p className="pagination-info">Showing 1 to {transactions.length} of {transactions.length} entries</p>
                    <div className="pagination-controls">
                        <button className="pagination-btn disabled">Previous</button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn disabled">Next</button>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {isModalOpen && selectedTransaction && (
                <div className="modal-overlay">
                    <div className="transaction-modal-content">
                        <div className="modal-header">
                            <h2>Transaction Details</h2>
                            <button className="close-btn" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Transaction ID:</span>
                                <span className="detail-value">{selectedTransaction.transactionId}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date:</span>
                                <span className="detail-value">{selectedTransaction.date}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Voucher Type:</span>
                                <span className="detail-value">{selectedTransaction.voucherType}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Voucher No:</span>
                                <span className="detail-value">{selectedTransaction.voucherNo}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Amount:</span>
                                <span className={`detail-value ${selectedTransaction.balanceType === 'Debit' ? 'text-success' : 'text-danger'}`}>
                                    ${selectedTransaction.amount}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Balance Type:</span>
                                <span className="detail-value">{selectedTransaction.balanceType}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">From/To:</span>
                                <span className="detail-value">{selectedTransaction.fromTo}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Account Type:</span>
                                <span className="detail-value">{selectedTransaction.accountType}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Note:</span>
                                <span className="detail-value">{selectedTransaction.note}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
