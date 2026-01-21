import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../../db/index';
import { cartItems } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '../middleware/auth';

const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export default async function cartRoutes(server: FastifyInstance) {
  // Get cart
  server.get('/', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id: userId } = request.user as any;

    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.userId, userId),
      with: {
        product: true,
      },
    });

    return reply.send({
      success: true,
      data: items,
    });
  });

  // Add to cart
  server.post('/', {
    preHandler: authenticate,
  }, async (request, reply) => {
    try {
      const { id: userId } = request.user as any;
      const body = addToCartSchema.parse(request.body);

      // Check if item already in cart
      const existing = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, body.productId)
        ),
      });

      if (existing) {
        // Update quantity
        const [updated] = await db.update(cartItems)
          .set({
            quantity: existing.quantity + body.quantity,
            updatedAt: new Date(),
          })
          .where(eq(cartItems.id, existing.id))
          .returning();

        return reply.send({
          success: true,
          data: updated,
        });
      }

      // Add new item
      const [item] = await db.insert(cartItems).values({
        userId,
        productId: body.productId,
        quantity: body.quantity,
      }).returning();

      return reply.code(201).send({
        success: true,
        data: item,
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

  // Update cart item
  server.put('/:itemId', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id: userId } = request.user as any;
    const { itemId } = request.params as { itemId: string };
    const { quantity } = request.body as { quantity: number };

    const [updated] = await db.update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(and(
        eq(cartItems.id, itemId),
        eq(cartItems.userId, userId)
      ))
      .returning();

    if (!updated) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Cart item not found',
        },
      });
    }

    return reply.send({
      success: true,
      data: updated,
    });
  });

  // Remove from cart
  server.delete('/:itemId', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id: userId } = request.user as any;
    const { itemId } = request.params as { itemId: string };

    await db.delete(cartItems)
      .where(and(
        eq(cartItems.id, itemId),
        eq(cartItems.userId, userId)
      ));

    return reply.send({
      success: true,
      data: {
        message: 'Item removed from cart',
      },
    });
  });

  // Clear cart
  server.delete('/', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id: userId } = request.user as any;

    await db.delete(cartItems)
      .where(eq(cartItems.userId, userId));

    return reply.send({
      success: true,
      data: {
        message: 'Cart cleared',
      },
    });
  });
}
