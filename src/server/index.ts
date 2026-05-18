import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const isDevelopment = process.env.NODE_ENV !== 'production';

const server = Fastify({
  logger: {
    level: isDevelopment ? 'info' : 'error',
  },
});

// Register plugins
await server.register(cors, {
  origin: isDevelopment ? ['http://localhost:5173', 'http://localhost:3001'] : process.env.CLIENT_URL,
  credentials: true,
});

await server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
});

await server.register(rateLimit, {
  global: false,
  max: 100,
  timeWindow: '15 minutes',
});

// Health check
server.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API Routes
await server.register(authRoutes, { prefix: '/api/auth' });
await server.register(productRoutes, { prefix: '/api/products' });
await server.register(cartRoutes, { prefix: '/api/cart' });
await server.register(orderRoutes, { prefix: '/api/orders' });
await server.register(paymentRoutes, { prefix: '/api/payments' });
await server.register(adminRoutes, { prefix: '/api/admin' });

// Serve static files in production
if (!isDevelopment) {
  const clientPath = path.join(__dirname, '../../dist/client');
  
  await server.register(fastifyStatic, {
    root: clientPath,
    prefix: '/',
  });

  // Serve index.html for all non-API routes (SPA)
  server.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api')) {
      reply.code(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found',
        },
      });
    } else {
      reply.sendFile('index.html');
    }
  });
}

// Error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);

  // JWT errors
  if (error.statusCode === 401) {
    return reply.code(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }

  // Validation errors
  if (error.validation) {
    return reply.code(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation,
      },
    });
  }

  // Default error
  reply.code(error.statusCode || 500).send({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
    },
  });
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
