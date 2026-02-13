const { resolvePath } = require('../../../config/appRoot');
const CartService = require(resolvePath('domains/cart/services/CartService'));

class CartController {
  // Get cart
  async getCart(req, res, next) {
    try {
      const cart = await CartService.getOrCreateCart(req.user.userId);

      res.status(200).json({
        success: true,
        cart,
      });
    } catch (error) {
      next(error);
    }
  }

  // Add to cart
  async addToCart(req, res, next) {
    try {
      const { productId, quantity } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }

      const cart = await CartService.addToCart(req.user.userId, productId, quantity || 1);

      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Remove from cart
  async removeFromCart(req, res, next) {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }

      const cart = await CartService.removeFromCart(req.user.userId, productId);

      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update quantity
  async updateQuantity(req, res, next) {
    try {
      const { productId, quantity } = req.body;

      if (!productId || quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and quantity are required',
        });
      }

      const cart = await CartService.updateQuantity(req.user.userId, productId, quantity);

      res.status(200).json({
        success: true,
        message: 'Quantity updated',
        cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Clear cart
  async clearCart(req, res, next) {
    try {
      const cart = await CartService.clearCart(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Cart cleared',
        cart,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get cart summary
  async getCartSummary(req, res, next) {
    try {
      const summary = await CartService.getCartSummary(req.user.userId);

      res.status(200).json({
        success: true,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
