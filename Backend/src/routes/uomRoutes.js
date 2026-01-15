const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getUnits,
    getUnit,
    createUnit,
    updateUnit,
    deleteUnit
} = require('../controllers/uomController');

// All routes require authentication
router.use(authenticateToken);

router.get('/', getUnits);
router.get('/:id', getUnit);
router.post('/', createUnit);
router.put('/:id', updateUnit);
router.delete('/:id', deleteUnit);

module.exports = router;
