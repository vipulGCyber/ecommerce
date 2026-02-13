const Product = require('../models/Product');

class ProductService {
  // Create product
  async createProduct(productData) {
    const { name, description, category, price, stock, sku, images, attributes } = productData;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      stock,
      sku,
      images: images || [],
      attributes: new Map(Object.entries(attributes || {})),
    });

    await newProduct.save();
    return newProduct;
  }

  // Get all products
  async getAllProducts(filters = {}) {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10, sortBy = 'createdAt' } = filters;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortBy === 'price' ? { price: 1 } : { [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get product by ID
  async getProductById(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  // Get product by slug
  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  // Update product
  async updateProduct(productId, updateData) {
    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Delete product (soft delete)
  async deleteProduct(productId) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Add review
  async addReview(productId, userId, rating, comment) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    product.reviews.push({
      userId,
      rating,
      comment,
    });

    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings.average = totalRating / product.reviews.length;
    product.ratings.count = product.reviews.length;

    await product.save();
    return product;
  }

  // Update stock
  async updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    product.stock -= quantity;
    if (product.stock < 0) {
      throw new Error('Insufficient stock');
    }

    await product.save();
    return product;
  }

  // Get low stock products (admin)
  async getLowStockProducts(threshold = 10) {
    const products = await Product.find({
      stock: { $lte: threshold },
      isActive: true,
    });

    return products;
  }
}

module.exports = new ProductService();
