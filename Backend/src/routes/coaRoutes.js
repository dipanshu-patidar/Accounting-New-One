const express = require('express');
const {
    createAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    initializeCOA,
    getAccountTypes
} = require('../controllers/coaController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Chart of Accounts routes - accessible by COMPANY, ADMIN users
router.get('/types', authenticateToken, getAccountTypes);
router.get('/', authenticateToken, getAccounts);
router.get('/:id', authenticateToken, getAccountById);
router.post('/', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), createAccount);
router.put('/:id', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), updateAccount);
router.delete('/:id', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), deleteAccount);

// Initialize COA for a company
router.post('/initialize', authenticateToken, authorizeRoles('COMPANY', 'ADMIN', 'SUPERADMIN'), initializeCOA);

module.exports = router;
