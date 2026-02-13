const { resolvePath } = require('../config/appRoot');
const ProductService = require(resolvePath('domains/product/services/ProductService'));
const OrderService = require(resolvePath('domains/order/services/OrderService'));
const CartService = require(resolvePath('domains/cart/services/CartService'));
const UserService = require(resolvePath('domains/user/services/UserService'));

class ViewsController {
  // Auth Views
  async loginPage(req, res, next) {
    try {
      // Check if user is already logged in
      if (req.user) {
        return res.redirect('/dashboard');
      }
      res.render('auth/login', { title: 'Login' });
    } catch (error) {
      next(error);
    }
  }

  async registerPage(req, res, next) {
    try {
      if (req.user) {
        return res.redirect('/dashboard');
      }
      res.render('auth/register', { title: 'Register' });
    } catch (error) {
      next(error);
    }
  }

  // Customer Views
  async productsPage(req, res, next) {
    try {
      const page = req.query.page || 1;
      const category = req.query.category || '';
      const products = await ProductService.getAllProducts({
        page,
        category,
        limit: 12,
      });

      res.render('customer/products', {
        title: 'Products',
        products: products.data || [],
        pagination: products.pagination || {},
        categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async cartPage(req, res, next) {
    try {
      const cart = await CartService.getOrCreateCart(req.user.userId);

      res.render('customer/cart', {
        title: 'Shopping Cart',
        cart,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Views
  async dashboardPage(req, res, next) {
    try {
      // Get dashboard statistics
      const stats = {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
        lowStockProducts: [],
        recentOrders: [],
        monthlyRevenue: [],
      };

      try {
        // Try to fetch real data if AdminService is available
        const orders = await OrderService.getAllOrders({ limit: 5 });
        const products = await ProductService.getAllProducts({ limit: 100 });
        const customers = await UserService.getAllCustomers({ limit: 1000 });

        stats.recentOrders = orders.data || [];
        stats.totalOrders = orders.total || 0;
        stats.totalProducts = products.total || 0;
        stats.totalCustomers = customers.total || 0;
        stats.lowStockProducts = (products.data || []).filter(p => p.stock < 10);

        // Calculate total revenue
        stats.totalRevenue = (orders.data || []).reduce((sum, order) => sum + (order.total || 0), 0);
      } catch (err) {
        console.log('Using mock data for dashboard stats:', err.message);
      }

      res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        stats,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async productsManagementPage(req, res, next) {
    try {
      const page = req.query.page || 1;
      const products = await ProductService.getAllProducts({
        page,
        limit: 20,
      });

      res.render('admin/products', {
        title: 'Manage Products',
        products: products.data || [],
        pagination: products.pagination || {},
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async ordersManagementPage(req, res, next) {
    try {
      const page = req.query.page || 1;
      const status = req.query.status || '';
      
      const orders = await OrderService.getAllOrders({
        page,
        status: status || undefined,
        limit: 20,
      });

      res.render('admin/orders', {
        title: 'Manage Orders',
        orders: orders.data || [],
        pagination: orders.pagination || {},
        statuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Home/Index page
  async homePage(req, res, next) {
    try {
      const products = await ProductService.getAllProducts({
        page: 1,
        limit: 6,
      });

      res.render('customer/products', {
        title: 'Home',
        products: products.data || [],
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ViewsController();
