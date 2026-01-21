import { FastifyInstance } from 'fastify';
import { db } from '../../db/index';
import { orders, products, users, orderItems } from '../../db/schema';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';

export default async function adminRoutes(server: FastifyInstance) {
  // Get dashboard stats
  server.get('/dashboard', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockProducts,
    ] = await Promise.all([
      db.select({ total: sql<number>`COALESCE(SUM(CAST(total_amount AS DECIMAL)), 0)` })
        .from(orders)
        .where(eq(orders.paymentStatus, 'paid')),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.isActive, true)),
      db.query.products.findMany({
        where: and(
          eq(products.isActive, true),
          lte(products.stockQuantity, 5)
        ),
        limit: 10,
      }),
    ]);

    return reply.send({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders: totalOrders[0]?.count || 0,
        totalProducts: totalProducts[0]?.count || 0,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
      },
    });
  });

  // Get all orders (admin)
  server.get('/orders', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    const { page = 1, limit = 20, orderStatus, paymentStatus } = request.query as any;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    if (orderStatus) conditions.push(eq(orders.orderStatus, orderStatus));
    if (paymentStatus) conditions.push(eq(orders.paymentStatus, paymentStatus));

    const [orderList, [{ count }]] = await Promise.all([
      db.query.orders.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
          orderItems: true,
        },
        limit: limitNum,
        offset,
        orderBy: desc(orders.createdAt),
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined),
    ]);

    return reply.send({
      success: true,
      data: {
        orders: orderList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: Number(count),
          totalPages: Math.ceil(Number(count) / limitNum),
        },
      },
    });
  });

  // Update order status
  server.put('/orders/:id/status', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { orderStatus } = request.body as { orderStatus: string };

    const [updated] = await db.update(orders)
      .set({
        orderStatus: orderStatus as any,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    if (!updated) {
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
      data: updated,
    });
  });

  // Update tracking number
  server.put('/orders/:id/tracking', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { trackingNumber } = request.body as { trackingNumber: string };

    const [updated] = await db.update(orders)
      .set({
        trackingNumber,
        orderStatus: 'shipped',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    if (!updated) {
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
      data: updated,
    });
  });

  // Get all customers
  server.get('/customers', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    const customers = await db.query.users.findMany({
      where: eq(users.role, 'customer'),
      columns: {
        passwordHash: false,
      },
      orderBy: desc(users.createdAt),
    });

    return reply.send({
      success: true,
      data: customers,
    });
  });

  // Revenue analytics
  server.get('/analytics/revenue', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    // TODO: Implement revenue analytics
    return reply.send({
      success: true,
      data: {
        message: 'Revenue analytics endpoint',
      },
    });
  });

  // Top products
  server.get('/analytics/top-products', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    const topProducts = await db
      .select({
        productId: orderItems.productId,
        productName: orderItems.productName,
        totalQuantity: sql<number>`SUM(${orderItems.quantity})`,
        totalRevenue: sql<number>`SUM(CAST(${orderItems.subtotal} AS DECIMAL))`,
      })
      .from(orderItems)
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(10);

    return reply.send({
      success: true,
      data: topProducts,
    });
  });
}
