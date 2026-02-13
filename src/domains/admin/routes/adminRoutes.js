const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authenticate, authorize } = require('../../../middleware/auth');

// Admin dashboard routes
router.get('/dashboard', authenticate, authorize('admin'), AdminController.getDashboardStats);
router.get('/analytics/sales', authenticate, authorize('admin'), AdminController.getSalesAnalytics);
router.get('/analytics/customers', authenticate, authorize('admin'), AdminController.getCustomerAnalytics);
router.get('/inventory', authenticate, authorize('admin'), AdminController.getInventoryStatus);

module.exports = router;
