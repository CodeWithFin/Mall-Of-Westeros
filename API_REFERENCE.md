# 🔌 API Quick Reference

Base URL: `http://localhost:3000/api`

## 📝 Authentication

### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe",
  "phone": "+254712345678"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@mallofwesteros.com",
  "password": "Admin123!"
}

# Response includes token - save it for authenticated requests
```

### Get Current User
```bash
GET /auth/me
Authorization: Bearer YOUR_TOKEN
```

## 📦 Products

### List Products
```bash
GET /products
GET /products?category=phone
GET /products?brand=Apple
GET /products?minPrice=100000&maxPrice=200000
GET /products?search=iPhone
GET /products?sort=price_desc
GET /products?page=1&limit=20
```

### Get Single Product
```bash
GET /products/:id
GET /products/slug/:slug
```

### Get Featured Products
```bash
GET /products/featured/list
```

### Create Product (Admin)
```bash
POST /products
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "category": "phone",
  "brand": "Apple",
  "model": "15 Pro",
  "description": "Latest iPhone",
  "specifications": {
    "screenSize": "6.1 inches",
    "ram": "8GB",
    "storage": "256GB",
    "camera": "48MP",
    "battery": "3274mAh",
    "os": "iOS 17"
  },
  "price": 145000,
  "stockQuantity": 10,
  "images": ["https://example.com/image.jpg"],
  "isFeatured": true
}
```

### Update Product (Admin)
```bash
PUT /products/:id
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "price": 140000,
  "stockQuantity": 15
}
```

### Delete Product (Admin)
```bash
DELETE /products/:id
Authorization: Bearer ADMIN_TOKEN
```

## 🛒 Shopping Cart

### Get Cart
```bash
GET /cart
Authorization: Bearer USER_TOKEN
```

### Add to Cart
```bash
POST /cart
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "productId": "uuid-here",
  "quantity": 1
}
```

### Update Cart Item
```bash
PUT /cart/:itemId
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "quantity": 2
}
```

### Remove from Cart
```bash
DELETE /cart/:itemId
Authorization: Bearer USER_TOKEN
```

### Clear Cart
```bash
DELETE /cart
Authorization: Bearer USER_TOKEN
```

## 📋 Orders

### Create Order
```bash
POST /orders
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+254712345678",
    "email": "john@example.com",
    "county": "Nairobi",
    "town": "Nairobi",
    "streetAddress": "123 Main St",
    "apartment": "Apt 4B",
    "notes": "Call on arrival"
  },
  "paymentMethod": "mpesa"
}
```

### Get User Orders
```bash
GET /orders
Authorization: Bearer USER_TOKEN
```

### Get Order Details
```bash
GET /orders/:id
Authorization: Bearer USER_TOKEN
```

### Cancel Order
```bash
POST /orders/:id/cancel
Authorization: Bearer USER_TOKEN
```

## 👑 Admin

### Dashboard Stats
```bash
GET /admin/dashboard
Authorization: Bearer ADMIN_TOKEN
```

### All Orders
```bash
GET /admin/orders
GET /admin/orders?orderStatus=paid
GET /admin/orders?paymentStatus=pending
GET /admin/orders?page=1&limit=20
Authorization: Bearer ADMIN_TOKEN
```

### Update Order Status
```bash
PUT /admin/orders/:id/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "orderStatus": "shipped"
}
```

### Update Tracking Number
```bash
PUT /admin/orders/:id/tracking
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "trackingNumber": "TRK123456789"
}
```

### List Customers
```bash
GET /admin/customers
Authorization: Bearer ADMIN_TOKEN
```

### Top Products
```bash
GET /admin/analytics/top-products
Authorization: Bearer ADMIN_TOKEN
```

## 💳 Payments

### M-Pesa Callback
```bash
POST /payments/mpesa/callback
# Called by Safaricom
```

### Stripe Webhook
```bash
POST /payments/card/webhook
# Called by Stripe
```

### Check Payment Status
```bash
GET /payments/:orderId/status
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## 🔐 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

## 🧪 Testing with cURL

### Quick Login Test
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mallofwesteros.com",
    "password": "Admin123!"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Get Products (Filtered)
```bash
curl "http://localhost:3000/api/products?category=phone&brand=Apple"
```

### Authenticated Request
```bash
# Save token from login response
TOKEN="your-jwt-token-here"

curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🛠️ Postman Collection

You can import these endpoints into Postman:
1. Create a new collection
2. Add environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `token`: `your-jwt-token`
3. Use `{{base_url}}` and `{{token}}` in requests

---

**Tip**: Use the seeded admin account for testing:
- Email: `admin@mallofwesteros.com`
- Password: `Admin123!`
