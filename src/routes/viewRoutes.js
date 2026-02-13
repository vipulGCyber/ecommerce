const express = require('express');
const router = express.Router();
const { resolvePath } = require('../config/appRoot');
const ViewsController = require(resolvePath('controllers/ViewsController'));
const { authenticate, authorize } = require(resolvePath('middleware/auth'));

// Public Routes
router.get('/', ViewsController.homePage);
router.get('/login', ViewsController.loginPage);
router.get('/register', ViewsController.registerPage);

// Protected Customer Routes
router.get('/products', ViewsController.productsPage);
router.get('/cart', authenticate, ViewsController.cartPage);

// Protected Admin Routes
router.get('/admin/dashboard', authenticate, authorize('admin'), ViewsController.dashboardPage);
router.get('/admin/products', authenticate, authorize('admin'), ViewsController.productsManagementPage);
router.get('/admin/orders', authenticate, authorize('admin'), ViewsController.ordersManagementPage);

module.exports = router;
