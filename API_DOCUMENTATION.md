# API Testing Guide

## Complete API Documentation

### Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### 1. Register New User
**POST** `/auth/register`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+1-555-1234"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 2. Login User
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 3. Get User Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "role": "customer",
    "addresses": [],
    "isActive": true
  }
}
```

---

### 4. Update Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-5678"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

### 5. Change Password
**PUT** `/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 6. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/products?page=1&limit=10&category=Electronics&minPrice=0&maxPrice=100&sortBy=createdAt`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `search`: Search query
- `sortBy`: Sort field (createdAt, price)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "...",
        "name": "Wireless Headphones",
        "slug": "wireless-headphones",
        "description": "High-quality wireless headphones",
        "category": "Electronics",
        "price": 79.99,
        "stock": 50,
        "ratings": { "average": 4.5, "count": 10 }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 2. Get Product by ID
**GET** `/products/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "product": { /* product object */ }
}
```

---

### 3. Create Product (Admin Only)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "category": "Electronics",
  "price": 99.99,
  "stock": 50,
  "sku": "PROD-001",
  "images": [],
  "attributes": {}
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": { /* created product */ }
}
```

---

### 4. Update Product (Admin Only)
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "price": 89.99,
  "stock": 40
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": { /* updated product */ }
}
```

---

### 5. Delete Product (Admin Only)
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 6. Add Product Review
**POST** `/products/:id/reviews`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "rating": 5,
  "comment": "Excellent product!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Review added successfully",
  "product": { /* updated product with review */ }
}
```

---

## Cart Endpoints

### 1. Get Cart
**GET** `/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "cart": {
    "_id": "...",
    "userId": "...",
    "items": [
      {
        "productId": "...",
        "quantity": 2,
        "addedAt": "2026-02-13T..."
      }
    ],
    "totalItems": 2,
    "totalPrice": 159.98
  }
}
```

---

### 2. Add to Cart
**POST** `/cart/add`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "productId": "...",
  "quantity": 1
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": { /* updated cart */ }
}
```

---

### 3. Update Quantity
**PUT** `/cart/update-quantity`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "productId": "...",
  "quantity": 3
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Quantity updated",
  "cart": { /* updated cart */ }
}
```

---

### 4. Remove from Cart
**POST** `/cart/remove`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "productId": "..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { /* updated cart */ }
}
```

---

### 5. Clear Cart
**DELETE** `/cart/clear`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### 6. Get Cart Summary
**GET** `/cart/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "summary": {
    "items": [ /* cart items */ ],
    "totalItems": 5,
    "totalPrice": 299.95
  }
}
```

---

## Order Endpoints

### 1. Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "items": [
    {
      "productId": "...",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "shippingCost": 10,
  "tax": 25
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "...",
    "orderNumber": "ORD-123456-001",
    "userId": "...",
    "items": [ /* order items */ ],
    "total": 299.99,
    "status": "pending"
  }
}
```

---

### 2. Get User Orders
**GET** `/orders/my-orders?page=1&limit=10`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [ /* user orders */ ],
    "pagination": { /* pagination info */ }
  }
}
```

---

### 3. Get Order Details
**GET** `/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "order": { /* order details */ }
}
```

---

### 4. Cancel Order
**PUT** `/orders/:id/cancel`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "cancellationReason": "Changed my mind"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Admin Endpoints

### 1. Get Dashboard Statistics
**GET** `/admin/dashboard`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "statistics": {
    "totalCustomers": 150,
    "totalProducts": 50,
    "totalOrders": 500,
    "completedOrders": 450,
    "totalRevenue": 45000.00,
    "recentOrders": [ /* recent orders */ ],
    "topProducts": [ /* top selling products */ ]
  }
}
```

---

### 2. Get Sales Analytics
**GET** `/admin/analytics/sales?period=monthly`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `period`: daily, weekly, or monthly

**Response:** `200 OK`
```json
{
  "success": true,
  "analytics": {
    "salesData": [
      {
        "_id": "2026-02",
        "totalSales": 15000.00,
        "orderCount": 150,
        "averageOrderValue": 100.00
      }
    ],
    "categoryWiseSales": [ /* sales by category */ ]
  }
}
```

---

### 3. Get Customer Analytics
**GET** `/admin/analytics/customers`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "analytics": {
    "totalCustomers": 150,
    "newCustomers": 25,
    "topCustomers": [ /* top customers by spending */ ]
  }
}
```

---

### 4. Get Inventory Status
**GET** `/admin/inventory`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "inventory": {
    "lowStockProducts": [ /* products with low stock */ ],
    "outOfStockProducts": [ /* out of stock products */ ],
    "totalInventoryValue": 250000.00
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [ /* field errors */ ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing with cURL Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "password":"password123",
    "confirmPassword":"password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Get Protected Resource
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/auth/profile
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

