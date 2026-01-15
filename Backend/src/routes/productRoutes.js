const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
} = require('../controllers/productController');

// All routes require authentication
router.use(authenticateToken);

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Stock management
router.put('/:productId/stock/:warehouseId', updateStock);

module.exports = router;
