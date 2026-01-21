import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { db } from '../../db/index';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { authenticate } from '../middleware/auth';
import { BCRYPT_SALT_ROUNDS } from '../../shared/constants';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(server: FastifyInstance) {
  // Register
  server.post('/register', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
      },
    },
  }, async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);

      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, body.email),
      });

      if (existingUser) {
        return reply.code(409).send({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'Email already registered',
          },
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);

      // Create user
      const [newUser] = await db.insert(users).values({
        email: body.email,
        passwordHash,
        fullName: body.fullName,
        phone: body.phone,
        role: 'customer',
      }).returning();

      // Generate token
      const token = server.jwt.sign({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      return reply.code(201).send({
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
          },
          token,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  });

  // Login
  server.post('/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
      },
    },
  }, async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      // Find user
      const user = await db.query.users.findFirst({
        where: eq(users.email, body.email),
      });

      if (!user || !user.isActive) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Verify password
      const isValid = await bcrypt.compare(body.password, user.passwordHash);

      if (!isValid) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Generate token
      const token = server.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  });

  // Get current user
  server.get('/me', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id } = request.user as any;

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        passwordHash: false,
      },
    });

    if (!user) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    return reply.send({
      success: true,
      data: user,
    });
  });

  // Logout
  server.post('/logout', {
    preHandler: authenticate,
  }, async (request, reply) => {
    return reply.send({
      success: true,
      data: {
        message: 'Logged out successfully',
      },
    });
  });
}
