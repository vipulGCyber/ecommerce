const { resolvePath } = require('../../../config/appRoot');
const ProductService = require(resolvePath('domains/product/services/ProductService'));

class ProductController {
  // Get all products
  async getAllProducts(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
        search: req.query.search,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: req.query.sortBy || 'createdAt',
      };

      const result = await ProductService.getAllProducts(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get product by ID
  async getProductById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get product by slug
  async getProductBySlug(req, res, next) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Create product (admin only)
  async createProduct(req, res, next) {
    try {
      const { name, description, category, price, stock, sku, images, attributes } = req.body;

      if (!name || !description || !category || !price || !sku) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
        });
      }

      const product = await ProductService.createProduct({
        name,
        description,
        category,
        price,
        stock: stock || 0,
        sku,
        images,
        attributes,
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update product (admin only)
  async updateProduct(req, res, next) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete product (admin only)
  async deleteProduct(req, res, next) {
    try {
      const product = await ProductService.deleteProduct(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Add review
  async addReview(req, res, next) {
    try {
      const { rating, comment } = req.body;

      if (!rating) {
        return res.status(400).json({
          success: false,
          message: 'Rating is required',
        });
      }

      const product = await ProductService.addReview(
        req.params.id,
        req.user.userId,
        rating,
        comment
      );

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get low stock products (admin only)
  async getLowStockProducts(req, res, next) {
    try {
      const threshold = req.query.threshold || 10;
      const products = await ProductService.getLowStockProducts(threshold);

      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
