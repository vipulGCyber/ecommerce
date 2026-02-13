# Setup Guide - E-Commerce Platform

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (locally or cloud instance)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
- Update `MONGODB_URI` with your MongoDB connection string
- Change `JWT_SECRET` and `SESSION_SECRET` to secure values
- Update admin credentials if needed

### 3. Start MongoDB

**On Windows:**
```bash
# If MongoDB is installed globally
mongod

# Or if installed as a service, it auto-starts
```

**On macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates:
- Admin user (admin@ecommerce.com / admin123456)
- 3 sample customers
- 6 sample products

### 5. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update profile
PUT    /api/auth/change-password   - Change password
```

### Products
```
GET    /api/products               - Get all products
GET    /api/products/:id           - Get product by ID
GET    /api/products/slug/:slug    - Get product by slug
POST   /api/products               - Create product (Admin)
PUT    /api/products/:id           - Update product (Admin)
DELETE /api/products/:id           - Delete product (Admin)
POST   /api/products/:id/reviews   - Add review
GET    /api/products/admin/low-stock - Get low stock products (Admin)
```

### Orders
```
POST   /api/orders                 - Create order
GET    /api/orders/my-orders       - Get user orders
GET    /api/orders/:id             - Get order details
PUT    /api/orders/:id/cancel      - Cancel order
GET    /api/orders/admin/all       - Get all orders (Admin)
PUT    /api/orders/admin/:id/status - Update order status (Admin)
```

### Cart
```
GET    /api/cart                   - Get cart
POST   /api/cart/add               - Add item to cart
POST   /api/cart/remove            - Remove item from cart
PUT    /api/cart/update-quantity   - Update item quantity
DELETE /api/cart/clear             - Clear cart
GET    /api/cart/summary           - Get cart summary
```

### Admin Dashboard
```
GET    /api/admin/dashboard        - Dashboard statistics
GET    /api/admin/analytics/sales  - Sales analytics
GET    /api/admin/analytics/customers - Customer analytics
GET    /api/admin/inventory        - Inventory status
```

## Default Users

### Admin
- **Email:** admin@ecommerce.com
- **Password:** admin123456
- **Role:** admin

### Sample Customers
- john@example.com / password123
- jane@example.com / password123
- bob@example.com / password123

## Project Structure

```
ecommerce-platform/
├── src/
│   ├── index.js                    # Application entry point
│   ├── config/
│   │   ├── database.js             # MongoDB connection
│   │   └── constants.js            # Application constants
│   ├── domains/
│   │   ├── user/                   # User domain (Auth, Customers)
│   │   ├── product/                # Product domain
│   │   ├── order/                  # Order domain
│   │   ├── cart/                   # Cart domain
│   │   └── admin/                  # Admin dashboard
│   ├── middleware/
│   │   ├── auth.js                 # Authentication & Authorization
│   │   ├── errorHandler.js         # Error handling
│   │   └── validation.js           # Input validation
│   ├── utils/
│   │   ├── helpers.js              # Utility functions
│   │   ├── logger.js               # Logging
│   │   └── emailService.js         # Email sending
│   ├── views/                      # EJS templates
│   ├── public/
│   │   ├── css/                    # Stylesheets
│   │   └── js/                     # Client-side scripts
│   └── scripts/
│       └── seedData.js             # Database seeding
├── tests/                          # Test files
├── package.json
├── .env                            # Environment variables
└── README.md
```

## Key Features

### Customer Features
✅ User Registration & Login
✅ Product Browse & Search
✅ Add to Cart
✅ Place Orders
✅ Order Tracking
✅ Address Management
✅ Product Reviews

### Admin Features
✅ Interactive Dashboard
✅ Sales Analytics
✅ Customer Management
✅ Product Management (CRUD)
✅ Order Management
✅ Inventory Tracking
✅ Revenue Reports

### Security
✅ JWT Authentication
✅ Password Hashing (bcryptjs)
✅ Rate Limiting
✅ Input Validation
✅ Helmet Security Headers
✅ CORS Protection
✅ Session Management

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running on your system

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change PORT in .env or kill the process using port 3000

### JWT Token Invalid
**Solution:** Ensure JWT_SECRET in .env is set correctly

## Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Products
curl http://localhost:3000/api/products
```

### Using Postman
1. Import the API endpoints
2. Set Authorization to Bearer Token
3. Paste the JWT token from login response
4. Test endpoints

## Running Tests

```bash
npm test
```

## Deployment

### Environment Variables for Production
```
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
SESSION_SECRET=<strong-random-secret>
```

### Heroku Deployment
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku addons:create mongolab:sandbox
git push heroku main
```

## Support & Documentation

- API Documentation: See API Endpoints section above
- MongoDB Documentation: https://docs.mongodb.com/
- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/

## License

MIT

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to the branch
5. Create a Pull Request

## Author

E-Commerce Platform Development Team
