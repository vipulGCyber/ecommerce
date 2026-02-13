# E-Commerce Platform

A comprehensive domain-driven Node.js ecommerce application with order management, customer management, admin panel with interactive dashboards, and product management.

## Features

### Customer Features
- User registration and login
- Browse and search products
- Add products to cart
- Place orders
- Order tracking
- Profile management
- Address management

### Admin Features
- Admin dashboard with interactive charts
- Product management (CRUD operations)
- Order management and tracking
- Customer management
- Sales analytics and reports
- Inventory management
- Role-based access control

### Security Features
- JWT authentication
- Password hashing with bcryptjs
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## Project Structure

```
ecommerce-platform/
├── src/
│   ├── index.js                 # Application entry point
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── constants.js         # Application constants
│   ├── domains/
│   │   ├── user/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   └── routes/
│   │   ├── product/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   └── routes/
│   │   ├── order/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   └── routes/
│   │   └── cart/
│   │       ├── models/
│   │       ├── services/
│   │       ├── controllers/
│   │       └── routes/
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Input validation
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   ├── logger.js            # Logging utility
│   │   └── emailService.js      # Email service
│   ├── views/
│   │   ├── layouts/
│   │   ├── admin/
│   │   ├── customer/
│   │   └── auth/
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── scripts/
│       └── seedData.js          # Database seeding
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   - MongoDB URI
   - JWT Secret
   - Admin credentials

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/admin/products` - Create product (Admin only)
- `PUT /api/admin/products/:id` - Update product (Admin only)
- `DELETE /api/admin/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/admin/orders/:id` - Update order status (Admin only)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Sales analytics
- `GET /api/admin/customers` - Manage customers

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Application port | 3000 |
| NODE_ENV | Environment | development/production |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ecommerce |
| JWT_SECRET | JWT signing secret | your_secret_key |
| JWT_EXPIRE | JWT expiration time | 7d |
| SESSION_SECRET | Session secret | your_session_secret |
| ADMIN_EMAIL | Default admin email | admin@ecommerce.com |
| ADMIN_PASSWORD | Default admin password | admin123456 |

## Admin Credentials

Default admin credentials (after seeding):
- Email: `admin@ecommerce.com`
- Password: `admin123456`

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js
- **Templating**: EJS
- **Security**: bcryptjs, Helmet, Rate Limiting
- **Testing**: Jest, Supertest

## Testing

Run tests:
```bash
npm test
```

## Development

- Use `npm run dev` for development with auto-reload
- Follow domain-driven design principles
- Keep business logic in services
- Use controllers for request/response handling
- Validate all inputs

## License

MIT

## Support

For support, please create an issue in the repository.
