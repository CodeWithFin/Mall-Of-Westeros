# Mall of Westeros

A modern, monolithic e-commerce platform for selling phones and laptops, built with a brutalist design aesthetic.

## 🚀 Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 18+** - UI framework
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **TailwindCSS** - Styling with custom brutalist theme

### Backend
- **Fastify** - High-performance Node.js web framework
- **Neon** - Serverless Postgres database
- **Drizzle ORM** - Type-safe database operations
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Payments
- **Stripe** - Card payments
- **M-Pesa (Daraja API)** - Mobile money (Kenya)

## 📋 Features

- ✅ Product catalog with filtering and search
- ✅ Shopping cart (persistent for logged-in users)
- ✅ User authentication & authorization
- ✅ Order management system
- ✅ Admin dashboard for products and orders
- ✅ Payment integration (Stripe & M-Pesa)
- ✅ Responsive brutalist design
- ✅ Full TypeScript support

## 🎨 Design System

Based on a neo-brutalist aesthetic with:
- **Colors**: Ink (#0A2A1F), Paper (#F8F4E8), Acid (#D2E823), Stone (#E5E0D6)
- **Typography**: Dela Gothic One (display), Space Grotesk (body)
- **Effects**: Hard shadows, bold borders, 2D elements

## 📁 Project Structure

```
mall-of-westeros/
├── src/
│   ├── client/          # React frontend
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom hooks
│   │   └── main.tsx     # Frontend entry point
│   ├── server/          # Fastify backend
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth & other middleware
│   │   └── index.ts     # Server entry point
│   ├── db/              # Database schema & queries
│   │   ├── schema.ts    # Drizzle schema
│   │   └── index.ts     # DB connection
│   └── shared/          # Shared types & utilities
├── drizzle/             # Database migrations
├── dist/                # Build output
└── public/              # Static assets
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Stripe account (for card payments)
- Safaricom Daraja API credentials (for M-Pesa)

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `DATABASE_URL` - Neon/PostgreSQL connection string
- `JWT_SECRET` - Random secret key for JWT
- `STRIPE_SECRET_KEY` - Stripe secret key
- `MPESA_CONSUMER_KEY` - M-Pesa consumer key
- `MPESA_CONSUMER_SECRET` - M-Pesa consumer secret
- Other SMTP and app settings

3. **Run database migrations**
```bash
npm run db:push
```

4. **Seed the database with sample data (optional)**
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@mallofwesteros.com` / `Admin123!`
- Customer user: `customer@example.com` / `Customer123!`
- Sample phones and laptops

5. **Start development servers**
```bash
npm run dev
```

This starts:
- Frontend dev server: `http://localhost:5173`
- Backend API server: `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📊 Database Schema

### Users
- Authentication and user profiles
- Role-based access (customer/admin)

### Products
- Phone and laptop inventory
- Specifications stored as JSONB
- Stock management

### Orders
- Complete order lifecycle management
- Payment status tracking
- Shipping information

### Cart Items
- Persistent shopping cart for logged-in users

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/customers` - List customers
- `GET /api/admin/analytics/top-products` - Top selling products

## 💳 Payment Integration

### Stripe (Card Payments)
1. Setup Stripe webhook endpoint: `/api/payments/card/webhook`
2. Configure webhook secret in `.env`
3. Handle payment confirmations

### M-Pesa (Daraja API)
1. Register STK Push callback URL: `/api/payments/mpesa/callback`
2. Configure shortcode and passkey in `.env`
3. Test in sandbox environment first

## 🎨 Customization

### Design Tokens
Edit `tailwind.config.js` to customize:
- Colors
- Typography
- Shadows
- Animations

### Database Schema
Modify `src/db/schema.ts` and run:
```bash
npm run db:generate
npm run db:push
```

## 📝 Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio

## 🚀 Deployment

### Recommended Platforms
- **Backend**: Railway, Render, Fly.io
- **Database**: Neon (serverless Postgres)
- **Frontend**: Served by Fastify in production

### Environment Variables
Ensure all production environment variables are set:
- Use strong JWT secrets
- Production Stripe keys
- Production M-Pesa credentials
- SMTP credentials for emails

## 📚 Documentation

- [PRD (Product Requirements Document)](./docs/PRD.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Test API endpoints before committing
4. Ensure UI matches brutalist design system

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Check if database is accessible
- Run `npm run db:push` to sync schema

### Frontend Not Loading
- Ensure both dev servers are running
- Check proxy configuration in `vite.config.ts`
- Clear browser cache

### Authentication Errors
- Verify JWT_SECRET is set
- Check token expiration settings
- Ensure bcrypt is properly installed

## 📞 Support

For issues and questions:
- Check documentation
- Review API responses for error codes
- Check server logs for detailed errors

---

**Built with ❤️ for Westeros**
# mall-of-westeros
