import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../../db/index';
import { orders, orderItems, cartItems, products } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticate } from '../middleware/auth';
import { generateOrderNumber, calculateShippingCost } from '../../shared/utils';

const createOrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    county: z.string(),
    town: z.string(),
    streetAddress: z.string(),
    apartment: z.string().optional(),
    notes: z.string().optional(),
  }),
  paymentMethod: z.enum(['card', 'mpesa']),
});

export default async function orderRoutes(server: FastifyInstance) {
  // Create order
  server.post('/', {
    preHandler: authenticate,
  }, async (request, reply) => {
    try {
      const { id: userId, email } = request.user as any;
      const body = createOrderSchema.parse(request.body);

      // Get cart items
      const cart = await db.query.cartItems.findMany({
        where: eq(cartItems.userId, userId),
        with: {
          product: true,
        },
      });

      if (cart.length === 0) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'EMPTY_CART',
            message: 'Cart is empty',
          },
        });
      }

      // Calculate totals
      let subtotal = 0;
      const items = cart.map((item) => {
        if (!item.product) throw new Error('Product not found');
        const itemSubtotal = parseFloat(item.product.price) * item.quantity;
        subtotal += itemSubtotal;
        return {
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          subtotal: itemSubtotal.toString(),
        };
      });

      const shippingCost = calculateShippingCost(subtotal);
      const totalAmount = subtotal + shippingCost;

      // Create order
      const [order] = await db.insert(orders).values({
        orderNumber: generateOrderNumber(),
        userId,
        customerEmail: email,
        shippingAddress: body.shippingAddress,
        subtotal: subtotal.toString(),
        shippingCost: shippingCost.toString(),
        totalAmount: totalAmount.toString(),
        paymentMethod: body.paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending_payment',
      }).returning();

      // Create order items
      await db.insert(orderItems).values(
        items.map((item) => ({
          orderId: order.id,
          ...item,
        }))
      );

      // Clear cart
      await db.delete(cartItems).where(eq(cartItems.userId, userId));

      return reply.code(201).send({
        success: true,
        data: {
          order,
          // Payment URL would be generated here for card payments
          // M-Pesa STK push would be initiated here
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

  // Get user orders
  server.get('/', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id: userId } = request.user as any;

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        orderItems: true,
      },
      orderBy: desc(orders.createdAt),
    });

    return reply.send({
      success: true,
      data: userOrders,
    });
  });

  // Get order by ID
  server.get('/:id', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id: userId } = request.user as any;
    const { id } = request.params as { id: string };

    const order = await db.query.orders.findFirst({
      where: and(
        eq(orders.id, id),
        eq(orders.userId, userId)
      ),
      with: {
        orderItems: true,
      },
    });

    if (!order) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found',
        },
      });
    }

    return reply.send({
      success: true,
      data: order,
    });
  });

  // Cancel order
  server.post('/:id/cancel', {
    preHandler: authenticate,
  }, async (request, reply) => {
    const { id: userId } = request.user as any;
    const { id } = request.params as { id: string };

    const order = await db.query.orders.findFirst({
      where: and(
        eq(orders.id, id),
        eq(orders.userId, userId)
      ),
    });

    if (!order) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found',
        },
      });
    }

    if (!['paid', 'processing'].includes(order.orderStatus)) {
      return reply.code(400).send({
        success: false,
        error: {
          code: 'CANNOT_CANCEL',
          message: 'Order cannot be cancelled at this stage',
        },
      });
    }

    const [updated] = await db.update(orders)
      .set({
        orderStatus: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return reply.send({
      success: true,
      data: updated,
    });
  });
}
