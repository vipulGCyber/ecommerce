const express = require('express');
const router = express.Router();
const path = require('path');
const OrderController = require(path.join(__dirname, '../controllers/OrderController'));
const { authenticate, authorize } = require(path.join(__dirname, '../../../middleware/auth'));

// Customer routes
router.post('/', authenticate, OrderController.createOrder);
router.get('/my-orders', authenticate, OrderController.getUserOrders);
router.get('/:id', authenticate, OrderController.getOrderById);
router.put('/:id/cancel', authenticate, OrderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), OrderController.getAllOrders);
router.put('/admin/:id/status', authenticate, authorize('admin'), OrderController.updateOrderStatus);
router.put('/admin/:id/payment-status', authenticate, authorize('admin'), OrderController.updatePaymentStatus);
router.get('/admin/statistics', authenticate, authorize('admin'), OrderController.getOrderStatistics);

module.exports = router;
