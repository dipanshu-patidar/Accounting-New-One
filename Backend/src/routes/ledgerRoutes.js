const express = require('express');
const {
    createLedgerEntry,
    getLedgerEntries,
    getLedgerEntryById,
    getAccountLedger,
    getNextVoucherNumber
} = require('../controllers/ledgerController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ledger routes
router.get('/voucher-number', authenticateToken, getNextVoucherNumber);
router.get('/', authenticateToken, getLedgerEntries);
router.get('/:id', authenticateToken, getLedgerEntryById);
router.get('/account/:accountId', authenticateToken, getAccountLedger);
router.post('/', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), createLedgerEntry);

module.exports = router;
