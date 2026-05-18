# Quick Start Guide - Mall of Westeros

## ⚡ Get Started in 5 Minutes

### 1. Setup Database

This project uses **[Neon](https://neon.tech)** serverless Postgres — not Supabase.

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy the connection string

### 2. Configure Environment

Edit `.env` and set your database URL:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your-random-secret-here-change-this
```

Generate a random JWT secret:
```bash
openssl rand -base64 32
```

### 3. Initialize Database

Push the schema to your database:

```bash
npm run db:push
```

### 4. Start Development

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### 5. Create First Admin User

You'll need to manually create an admin user in the database, or register a user and update their role:

```sql
-- After registering through the UI, update a user to admin:
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 🎯 Next Steps

### Add Sample Products

Use the admin panel or API to add products:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "category": "phone",
    "brand": "Apple",
    "model": "15 Pro",
    "description": "Latest iPhone with amazing features",
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
    "images": ["https://example.com/iphone.jpg"],
    "isFeatured": true
  }'
```

### Setup Payments (Optional for Development)

#### Stripe
1. Create account at https://stripe.com
2. Get test API keys from dashboard
3. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### M-Pesa (Optional)
1. Register at https://developer.safaricom.co.ke
2. Get sandbox credentials
3. Add to `.env`:
```env
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=174379
MPESA_PASSKEY=...
MPESA_ENVIRONMENT=sandbox
```

## 📱 Test the Application

1. **Visit Homepage**: http://localhost:5173
2. **Register Account**: Click register, create an account
3. **Browse Products**: Navigate to products page
4. **Add to Cart**: Add products to cart
5. **Checkout**: Complete checkout flow
6. **Admin Panel**: http://localhost:5173/admin (requires admin role)

## 🐛 Troubleshooting

### Database Connection Failed
- Check `DATABASE_URL` format
- Ensure database is accessible
- Try: `npm run db:push` again

### Port Already in Use
```bash
# Change ports in .env
PORT=3001
```

Then update vite proxy in `vite.config.ts`:
```ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
  },
}
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deploy to Production

### Build for Production
```bash
npm run build
```

### Environment Variables Needed
- `DATABASE_URL` - Production database
- `JWT_SECRET` - Strong random secret
- `NODE_ENV=production`
- `CLIENT_URL` - Your domain
- Payment credentials (if enabled)

### Recommended Platforms
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Fly.io**: https://fly.io

All support Node.js and can connect to Neon database.

---

**Need Help?** Check [README.md](./README.md) for full documentation.
