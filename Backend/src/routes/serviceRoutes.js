const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

// All routes require authentication
router.use(authenticateToken);

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
