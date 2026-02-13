const express = require('express');
const router = express.Router();
const { resolvePath } = require('../../../config/appRoot');
const CartController = require(resolvePath('domains/cart/controllers/CartController'));
const { authenticate } = require(resolvePath('middleware/auth'));

router.get('/', authenticate, CartController.getCart);
router.post('/add', authenticate, CartController.addToCart);
router.post('/remove', authenticate, CartController.removeFromCart);
router.put('/update-quantity', authenticate, CartController.updateQuantity);
router.delete('/clear', authenticate, CartController.clearCart);
router.get('/summary', authenticate, CartController.getCartSummary);

module.exports = router;
