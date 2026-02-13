const express = require('express');
const router = express.Router();
const { resolvePath } = require('../../../config/appRoot');
const ProductController = require(resolvePath('domains/product/controllers/ProductController'));
const { authenticate, authorize } = require(resolvePath('middleware/auth'));

// Customer routes
router.get('/', ProductController.getAllProducts);
router.get('/slug/:slug', ProductController.getProductBySlug);
router.get('/:id', ProductController.getProductById);
router.post('/:id/reviews', authenticate, ProductController.addReview);

// Admin routes
router.post('/', authenticate, authorize('admin'), ProductController.createProduct);
router.put('/:id', authenticate, authorize('admin'), ProductController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), ProductController.deleteProduct);
router.get('/admin/low-stock', authenticate, authorize('admin'), ProductController.getLowStockProducts);

module.exports = router;
