# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
# MongoDB should be running
# Update .env file with your MongoDB URI
```

### Step 3: Seed Database (Optional)
```bash
npm run seed
```

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Test
Open `http://localhost:3000/health` in your browser

---

## Quick API Tests

### Register & Login
```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@test.com",
    "password":"password123",
    "confirmPassword":"password123"
  }'

# 2. Login & get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# 3. Use token in subsequent requests
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Default Admin Account
- **Email:** admin@ecommerce.com
- **Password:** admin123456
- **API Token:** Login to get token

---

## Database Models

### User Schema
```
{
  firstName: String
  lastName: String
  email: String (unique)
  password: String (hashed)
  phone: String
  role: 'admin' | 'customer'
  isActive: Boolean
  addresses: Array
  profileImage: String
  lastLogin: Date
}
```

### Product Schema
```
{
  name: String
  slug: String (auto-generated)
  description: String
  category: String
  price: Number
  discountPrice: Number
  stock: Number
  images: Array
  ratings: { average, count }
  reviews: Array
  isActive: Boolean
  sku: String (unique)
  attributes: Map
}
```

### Order Schema
```
{
  orderNumber: String (unique)
  userId: ObjectId
  items: Array
  shippingAddress: Object
  subtotal: Number
  shippingCost: Number
  tax: Number
  discountAmount: Number
  total: Number
  status: 'pending'|'confirmed'|'shipped'|'delivered'|'cancelled'
  paymentStatus: 'pending'|'completed'|'failed'|'refunded'
  paymentMethod: String
  trackingNumber: String
}
```

### Cart Schema
```
{
  userId: ObjectId
  items: Array
  totalItems: Number
  totalPrice: Number
}
```

---

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (requires auth)
- `GET /api/auth/profile` - Get profile (requires auth)

### Products
- `GET /api/products` - Browse products
- `GET /api/products/:id` - Product details
- `POST /api/products` - Create (admin only)
- `PUT /api/products/:id` - Update (admin only)
- `DELETE /api/products/:id` - Delete (admin only)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders/my-orders` - My orders (requires auth)
- `GET /api/orders/:id` - Order details (requires auth)
- `GET /api/orders/admin/all` - All orders (admin only)
- `PUT /api/orders/admin/:id/status` - Update status (admin only)

### Cart
- `GET /api/cart` - Get cart (requires auth)
- `POST /api/cart/add` - Add item (requires auth)
- `POST /api/cart/remove` - Remove item (requires auth)
- `PUT /api/cart/update-quantity` - Update qty (requires auth)

### Admin Dashboard
- `GET /api/admin/dashboard` - Dashboard stats (admin only)
- `GET /api/admin/analytics/sales` - Sales analytics (admin only)
- `GET /api/admin/analytics/customers` - Customer analytics (admin only)

---

## File Structure

```
src/
├── domains/          # Business domains (DDD pattern)
│   ├── user/        # User management & auth
│   ├── product/     # Product catalog
│   ├── order/       # Order processing
│   ├── cart/        # Shopping cart
│   └── admin/       # Admin dashboard
├── middleware/       # Express middleware
├── utils/           # Helper functions
├── config/          # Configuration files
├── views/           # EJS templates
├── public/          # Static files
└── scripts/         # Utility scripts

tests/               # Test files
```

---

## Environment Variables

```
PORT=3000                                    # Server port
NODE_ENV=development                         # dev/production
MONGODB_URI=mongodb://localhost:27017/...   # MongoDB connection
JWT_SECRET=your_secret_key                   # JWT signing key
JWT_EXPIRE=7d                               # JWT expiration
SESSION_SECRET=your_session_secret           # Session encryption
ADMIN_EMAIL=admin@ecommerce.com             # Default admin
ADMIN_PASSWORD=admin123456                  # Default admin password
```

---

## Common Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm start               # Start server

# Database
npm run seed            # Populate sample data

# Testing
npm test               # Run tests

# Cleanup
rm -rf node_modules    # Remove dependencies
npm install            # Reinstall dependencies
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running |
| Port 3000 in use | Change PORT in .env or kill process |
| JWT token invalid | Check JWT_SECRET in .env |
| Products not loading | Seed database with `npm run seed` |
| Can't create orders | Ensure products exist in database |

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure .env
3. ✅ Start MongoDB
4. ✅ Run `npm run seed` (optional)
5. ✅ Start server with `npm run dev`
6. ✅ Test API endpoints
7. ✅ Customize as needed

---

## Support

For detailed documentation, see `SETUP.md`

For API documentation, see `README.md`
