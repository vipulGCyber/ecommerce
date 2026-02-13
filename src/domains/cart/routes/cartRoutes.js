const express = require('express');
const router = express.Router();
const path = require('path');
const CartController = require(path.join(__dirname, '../controllers/CartController'));
const { authenticate } = require(path.join(__dirname, '../../../middleware/auth'));

router.get('/', authenticate, CartController.getCart);
router.post('/add', authenticate, CartController.addToCart);
router.post('/remove', authenticate, CartController.removeFromCart);
router.put('/update-quantity', authenticate, CartController.updateQuantity);
router.delete('/clear', authenticate, CartController.clearCart);
router.get('/summary', authenticate, CartController.getCartSummary);

module.exports = router;
