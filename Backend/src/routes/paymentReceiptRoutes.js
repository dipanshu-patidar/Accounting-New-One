const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getPayments,
    getPayment,
    createPayment,
    deletePayment,
    getInvoicesForPayment
} = require('../controllers/paymentReceiptController');

// All routes require authentication
router.use(authenticateToken);

router.get('/', getPayments);
router.get('/invoices', getInvoicesForPayment);
router.get('/:id', getPayment);
router.post('/', createPayment);
router.delete('/:id', deletePayment);

module.exports = router;
