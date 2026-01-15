const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice
} = require('../controllers/salesInvoiceController');

// All routes require authentication
router.use(authenticateToken);

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.post('/:id/send', sendInvoice);

module.exports = router;
