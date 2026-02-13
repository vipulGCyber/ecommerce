const path = require('path');
const Cart = require(path.join(__dirname, '../models/Cart'));
const Product = require(path.join(__dirname, '../../product/models/Product'));

class CartService {
  // Get or create cart
  async getOrCreateCart(userId) {
    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }

    return cart;
  }

  // Add item to cart
  async addToCart(userId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    let cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    await this.calculateTotals(cart);
    await cart.save();

    return cart.populate('items.productId');
  }

  // Remove item from cart
  async removeFromCart(userId, productId) {
    const cart = await this.getOrCreateCart(userId);

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    await this.calculateTotals(cart);
    await cart.save();

    return cart.populate('items.productId');
  }

  // Update cart item quantity
  async updateQuantity(userId, productId, quantity) {
    const cart = await this.getOrCreateCart(userId);

    const item = cart.items.find((item) => item.productId.toString() === productId);

    if (!item) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    } else {
      const product = await Product.findById(productId);
      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }
      item.quantity = quantity;
    }

    await this.calculateTotals(cart);
    await cart.save();

    return cart.populate('items.productId');
  }

  // Clear cart
  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    return cart;
  }

  // Calculate cart totals
  async calculateTotals(cart) {
    let totalPrice = 0;
    let totalItems = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalPrice += product.price * item.quantity;
        totalItems += item.quantity;
      }
    }

    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;
  }

  // Get cart summary
  async getCartSummary(userId) {
    const cart = await this.getOrCreateCart(userId);
    return {
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
    };
  }
}

module.exports = new CartService();
