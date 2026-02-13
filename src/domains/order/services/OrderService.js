const Order = require('../models/Order');
const Product = require('../../product/models/Product');
const ProductService = require('../../product/services/ProductService');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../../../config/constants');

class OrderService {
  // Create order
  async createOrder(userId, orderData) {
    const { items, shippingAddress, paymentMethod, shippingCost = 0, tax = 0, discountAmount = 0 } = orderData;

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Validate stock and calculate subtotal
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      processedItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        discount: item.discount || 0,
      });

      // Update product stock
      await ProductService.updateStock(product._id, item.quantity);
    }

    const total = subtotal + shippingCost + tax - discountAmount;

    const newOrder = new Order({
      userId,
      items: processedItems,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      discountAmount,
      total,
      paymentMethod,
    });

    await newOrder.save();
    return newOrder.populate('userId', 'firstName lastName email');
  }

  // Get order by ID
  async getOrderById(orderId) {
    const order = await Order.findById(orderId)
      .populate('userId', 'firstName lastName email phone')
      .populate('items.productId', 'name slug');

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Get user orders
  async getUserOrders(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments({ userId });

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get all orders (admin)
  async getAllOrders(filters = {}) {
    const { status, paymentStatus, page = 1, limit = 10, startDate, endDate } = filters;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    const updateData = { status };

    if (status === ORDER_STATUS.SHIPPED) {
      updateData.shippedDate = new Date();
      updateData.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    } else if (status === ORDER_STATUS.DELIVERED) {
      updateData.deliveredDate = new Date();
    } else if (status === ORDER_STATUS.CANCELLED) {
      updateData.cancelledDate = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus) {
    const validStatuses = Object.values(PAYMENT_STATUS);
    if (!validStatuses.includes(paymentStatus)) {
      throw new Error(`Invalid payment status: ${paymentStatus}`);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Cancel order
  async cancelOrder(orderId, cancellationReason) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) {
      throw new Error('Cannot cancel this order');
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.cancellationReason = cancellationReason;
    order.cancelledDate = new Date();

    await order.save();
    return order;
  }

  // Get order statistics
  async getOrderStatistics(startDate, endDate) {
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query);

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
      ordersByStatus: {},
      ordersByPaymentStatus: {},
    };

    // Count by status
    orders.forEach((order) => {
      stats.ordersByStatus[order.status] = (stats.ordersByStatus[order.status] || 0) + 1;
      stats.ordersByPaymentStatus[order.paymentStatus] = (stats.ordersByPaymentStatus[order.paymentStatus] || 0) + 1;
    });

    return stats;
  }
}

module.exports = new OrderService();
