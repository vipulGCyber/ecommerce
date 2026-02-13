const Order = require('../order/models/Order');
const User = require('../user/models/User');
const Product = require('../product/models/Product');
const { USER_ROLES, ORDER_STATUS } = require('../../config/constants');

class AdminController {
  // Get dashboard statistics
  async getDashboardStats(req, res, next) {
    try {
      const totalCustomers = await User.countDocuments({ role: USER_ROLES.CUSTOMER });
      const totalProducts = await Product.countDocuments({ isActive: true });
      const totalOrders = await Order.countDocuments();

      const completedOrders = await Order.countDocuments({
        status: ORDER_STATUS.DELIVERED,
      });

      // Calculate revenue
      const revenueData = await Order.aggregate([
        {
          $match: { status: ORDER_STATUS.DELIVERED },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
          },
        },
      ]);

      const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

      // Recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'firstName lastName email');

      // Top products
      const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalSold: { $sum: '$items.quantity' },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
      ]);

      res.status(200).json({
        success: true,
        statistics: {
          totalCustomers,
          totalProducts,
          totalOrders,
          completedOrders,
          totalRevenue,
          recentOrders,
          topProducts,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sales analytics
  async getSalesAnalytics(req, res, next) {
    try {
      const { period = 'monthly' } = req.query;

      let groupBy;
      if (period === 'daily') {
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      } else if (period === 'weekly') {
        groupBy = { $week: '$createdAt' };
      } else {
        groupBy = { $month: '$createdAt' };
      }

      const salesData = await Order.aggregate([
        {
          $group: {
            _id: groupBy,
            totalSales: { $sum: '$total' },
            orderCount: { $sum: 1 },
            averageOrderValue: { $avg: '$total' },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Category-wise sales
      const categoryWiseSales = await Order.aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' },
        {
          $group: {
            _id: '$productDetails.category',
            totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalSales: -1 } },
      ]);

      res.status(200).json({
        success: true,
        analytics: {
          salesData,
          categoryWiseSales,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(req, res, next) {
    try {
      const totalCustomers = await User.countDocuments({ role: USER_ROLES.CUSTOMER });

      // New customers this month
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const newCustomers = await User.countDocuments({
        role: USER_ROLES.CUSTOMER,
        createdAt: { $gte: startOfMonth },
      });

      // Top customers by order value
      const topCustomers = await Order.aggregate([
        {
          $group: {
            _id: '$userId',
            totalSpent: { $sum: '$total' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
      ]);

      res.status(200).json({
        success: true,
        analytics: {
          totalCustomers,
          newCustomers,
          topCustomers,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get inventory status
  async getInventoryStatus(req, res, next) {
    try {
      const lowStockProducts = await Product.find({ stock: { $lte: 10 } }).select(
        'name stock sku category'
      );

      const outOfStockProducts = await Product.find({ stock: 0 }).select('name sku category');

      const totalInventoryValue = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          },
        },
      ]);

      res.status(200).json({
        success: true,
        inventory: {
          lowStockProducts,
          outOfStockProducts,
          totalInventoryValue: totalInventoryValue.length > 0 ? totalInventoryValue[0].totalValue : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
