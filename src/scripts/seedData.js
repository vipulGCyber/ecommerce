require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const connectDB = require('../config/database');
const User = require('../domains/user/models/User');
const Product = require('../domains/product/models/Product');
const { USER_ROLES, PRODUCT_CATEGORIES } = require('../config/constants');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      phone: '+1-555-0000',
      role: USER_ROLES.ADMIN,
    });
    await adminUser.save();
    console.log('Admin user created:', adminUser.email);

    // Create sample customers
    console.log('Creating sample customers...');
    const customers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1-555-0001',
        role: USER_ROLES.CUSTOMER,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+1-555-0002',
        role: USER_ROLES.CUSTOMER,
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        password: 'password123',
        phone: '+1-555-0003',
        role: USER_ROLES.CUSTOMER,
      },
    ];

    for (const customerData of customers) {
      const customer = new User(customerData);
      await customer.save();
      console.log(`Customer created: ${customer.email}`);
    }

    // Create sample products
    console.log('Creating sample products...');
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        category: 'Electronics',
        price: 79.99,
        stock: 50,
        sku: 'ELEC-001',
        images: [],
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        category: 'Clothing',
        price: 29.99,
        stock: 100,
        sku: 'CLOTH-001',
        images: [],
      },
      {
        name: 'Garden Tool Set',
        description: 'Complete garden tool set with 10 tools',
        category: 'Home & Garden',
        price: 39.99,
        stock: 30,
        sku: 'GARDEN-001',
        images: [],
      },
      {
        name: 'JavaScript Programming Book',
        description: 'Learn JavaScript from basics to advanced',
        category: 'Books',
        price: 49.99,
        stock: 20,
        sku: 'BOOK-001',
        images: [],
      },
      {
        name: 'Laptop Stand',
        description: 'Portable laptop stand for comfortable working',
        category: 'Electronics',
        price: 39.99,
        stock: 40,
        sku: 'ELEC-002',
        images: [],
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        category: 'Home & Garden',
        price: 34.99,
        stock: 35,
        sku: 'GARDEN-002',
        images: [],
      },
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      console.log(`Product created: ${product.name}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nDefault Admin Credentials:');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@ecommerce.com'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
