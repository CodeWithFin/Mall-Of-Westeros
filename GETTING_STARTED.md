# ✅ Getting Started Checklist

Follow these steps in order to get Mall of Westeros running.

## Step 1: Database Setup

- [ ] Create a **Neon** account at https://neon.tech (this project uses Neon, not Supabase)
- [ ] Create a new project in Neon
- [ ] Copy the connection string
- [ ] Open `.env` file in the project root
- [ ] Paste your database URL in `DATABASE_URL`
- [ ] Generate a JWT secret: Run `openssl rand -base64 32`
- [ ] Paste the result in `JWT_SECRET`
- [ ] Save the `.env` file

**Your `.env` should look like:**
```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
JWT_SECRET=mB8kX2pL9qR3...
JWT_REFRESH_SECRET=nC7jY1oK8pQ2...
```

## Step 2: Install Dependencies

- [ ] Open terminal in project folder
- [ ] Run: `npm install`
- [ ] Wait for installation to complete (may take 2-3 minutes)

## Step 3: Setup Database

- [ ] Run: `npm run db:push`
- [ ] Wait for schema to be pushed to database
- [ ] You should see: "✓ Changes applied"

## Step 4: Add Sample Data

- [ ] Run: `npm run db:seed`
- [ ] You should see:
  ```
  ✅ Created admin user: admin@mallofwesteros.com
  ✅ Created customer user: customer@example.com
  ✅ Created product: iPhone 15 Pro Max
  ... (more products)
  🎉 Database seeded successfully!
  ```

## Step 5: Start Development

- [ ] Run: `npm run dev`
- [ ] You should see:
  ```
  🚀 Server running on http://0.0.0.0:3000
  VITE ready in XXX ms
  ```
- [ ] Frontend is at: http://localhost:5173
- [ ] Backend API is at: http://localhost:3000

## Step 6: Verify Everything Works

- [ ] Open browser to http://localhost:5173
- [ ] You should see the Mall of Westeros homepage
- [ ] Navigation menu should be visible
- [ ] No console errors

## Step 7: Test the API

- [ ] Open a new terminal
- [ ] Test health check:
  ```bash
  curl http://localhost:3000/api/health
  ```
- [ ] Should return: `{"status":"ok","timestamp":"..."}`

- [ ] Test login:
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@mallofwesteros.com","password":"Admin123!"}'
  ```
- [ ] Should return a token

- [ ] Test products:
  ```bash
  curl http://localhost:3000/api/products
  ```
- [ ] Should return list of products

## Step 8: Explore Admin Features

- [ ] Login with admin credentials:
  - Email: `admin@mallofwesteros.com`
  - Password: `Admin123!`
  
- [ ] Test admin endpoints (use the token from login):
  ```bash
  TOKEN="your-token-here"
  curl http://localhost:3000/api/admin/dashboard \
    -H "Authorization: Bearer $TOKEN"
  ```

## Step 9: Optional - View Database

- [ ] Run: `npm run db:studio`
- [ ] Opens Drizzle Studio in browser
- [ ] You can view and edit all tables

## Step 10: Start Building!

Now you're ready to:
- [ ] Build frontend pages (see ROADMAP.md)
- [ ] Add payment integration (see README.md)
- [ ] Customize the design
- [ ] Add more features

## 🆘 Troubleshooting

### Database Connection Failed
```
Error: getaddrinfo ENOTFOUND
```
**Fix:** Check your `DATABASE_URL` in `.env`. Make sure it's correct.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Fix:** 
- Kill the process: `lsof -ti:3000 | xargs kill`
- Or change the port in `.env`: `PORT=3001`

### Module Not Found Errors
```
Cannot find module 'fastify'
```
**Fix:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Database Schema Errors
```
Error: relation "products" does not exist
```
**Fix:**
- Run `npm run db:push` again
- If still fails, check database connection

## 📚 What to Read Next

- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Overview of what's been built
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference guide
- [ROADMAP.md](./ROADMAP.md) - Development plan
- [API_REFERENCE.md](./API_REFERENCE.md) - All API endpoints
- [README.md](./README.md) - Full documentation

## 🎉 Success!

If you completed all steps without errors, you're ready to develop!

**Next Steps:**
1. Explore the codebase
2. Review the documentation
3. Start building frontend pages
4. Test API endpoints
5. Have fun! 🚀
