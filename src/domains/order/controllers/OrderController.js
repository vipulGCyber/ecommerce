const { resolvePath } = require('../../../config/appRoot');
const OrderService = require(resolvePath('domains/order/services/OrderService'));

class OrderController {
  // Create order
  async createOrder(req, res, next) {
    try {
      const { items, shippingAddress, paymentMethod, shippingCost, tax, discountAmount } = req.body;

      if (!items || !shippingAddress || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
        });
      }

      const order = await OrderService.createOrder(req.user.userId, {
        items,
        shippingAddress,
        paymentMethod,
        shippingCost,
        tax,
        discountAmount,
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get order by ID
  async getOrderById(req, res, next) {
    try {
      const order = await OrderService.getOrderById(req.params.id);

      // Check if user owns this order or is admin
      if (order.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user orders
  async getUserOrders(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const result = await OrderService.getUserOrders(req.user.userId, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all orders (admin)
  async getAllOrders(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        paymentStatus: req.query.paymentStatus,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const result = await OrderService.getAllOrders(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update order status (admin)
  async updateOrderStatus(req, res, next) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const order = await OrderService.updateOrderStatus(req.params.id, status);

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update payment status (admin)
  async updatePaymentStatus(req, res, next) {
    try {
      const { paymentStatus } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: 'Payment status is required',
        });
      }

      const order = await OrderService.updatePaymentStatus(req.params.id, paymentStatus);

      res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Cancel order
  async cancelOrder(req, res, next) {
    try {
      const { cancellationReason } = req.body;
      const order = await OrderService.cancelOrder(req.params.id, cancellationReason);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get order statistics (admin)
  async getOrderStatistics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const stats = await OrderService.getOrderStatistics(startDate, endDate);

      res.status(200).json({
        success: true,
        statistics: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
