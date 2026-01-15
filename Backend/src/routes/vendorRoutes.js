const express = require('express');
const {
    createVendor,
    getVendors,
    getVendorById,
    updateVendor,
    deleteVendor
} = require('../controllers/vendorController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Vendor routes - accessible by COMPANY, ADMIN users
router.get('/', authenticateToken, getVendors);
router.get('/:id', authenticateToken, getVendorById);
router.post('/', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), createVendor);
router.put('/:id', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), updateVendor);
router.delete('/:id', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), deleteVendor);

module.exports = router;
