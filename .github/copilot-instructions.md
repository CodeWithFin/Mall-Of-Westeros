# Mall of Westeros - Copilot Instructions

## Project Overview
Mall of Westeros is a monolithic e-commerce platform for selling phones and laptops, built with:
- Frontend: Vite + React + TailwindCSS + TanStack Query
- Backend: Fastify (serves both API and static frontend)
- Database: Neon Postgres with Drizzle ORM
- Payments: Stripe (cards) + M-Pesa (Daraja API)

## Design Style
- Brutalist/neo-brutalist aesthetic
- Colors: ink (#0A2A1F), paper (#F8F4E8), acid (#D2E823), stone (#E5E0D6)
- Fonts: Dela Gothic One (display), Space Grotesk (body)
- Hard shadows (4px 4px), bold borders, rounded corners

## Project Structure
- `/src/server` - Fastify backend (routes, middleware, controllers)
- `/src/client` - React frontend (pages, components, hooks)
- `/src/db` - Drizzle schema, migrations, queries
- `/src/shared` - Shared types, utilities, constants
- `/public` - Static assets (after build)

## Development Guidelines
- Use TypeScript for all code
- Validate with Zod schemas
- JWT authentication with refresh tokens
- Rate limiting on sensitive endpoints
- Responsive mobile-first design
- Hard shadows and brutalist UI patterns

## Status
✅ Project structure initialized
✅ Database schema complete
✅ Backend API implemented (85%)
✅ Frontend foundation ready (40%)
✅ Authentication system working
✅ Documentation complete

## Quick Start
1. `cp .env.example .env` - Configure database URL
2. `npm run db:push` - Setup database
3. `npm run db:seed` - Add sample data
4. `npm run dev` - Start development servers

## Test Credentials (After Seeding)
- Admin: admin@mallofwesteros.com / Admin123!
- Customer: customer@example.com / Customer123!
