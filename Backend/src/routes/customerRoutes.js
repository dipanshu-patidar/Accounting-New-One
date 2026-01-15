const express = require('express');
const {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Customer routes - accessible by COMPANY, ADMIN users
router.get('/', authenticateToken, getCustomers);
router.get('/:id', authenticateToken, getCustomerById);
router.post('/', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), createCustomer);
router.put('/:id', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), updateCustomer);
router.delete('/:id', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), deleteCustomer);

module.exports = router;
