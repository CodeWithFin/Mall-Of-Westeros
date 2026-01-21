import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../../db/index';
import { products } from '../../db/schema';
import { eq, and, gte, lte, ilike, or, desc, asc, sql } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';
import { slugify } from '../../shared/utils';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';

const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(['phone', 'laptop']),
  brand: z.string().min(1),
  model: z.string().min(1),
  description: z.string().min(1).max(2000),
  specifications: z.record(z.string()),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0).default(0),
  images: z.array(z.string().url()).min(1).max(5),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export default async function productRoutes(server: FastifyInstance) {
  // Get all products with filters
  server.get('/', async (request, reply) => {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      inStock,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
      sort = 'newest',
    } = request.query as any;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const conditions = [eq(products.isActive, true)];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (brand) {
      conditions.push(eq(products.brand, brand));
    }

    if (minPrice) {
      conditions.push(gte(products.price, minPrice.toString()));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.brand, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )!
      );
    }

    if (inStock === 'true') {
      conditions.push(gte(products.stockQuantity, 1));
    }

    // Determine sort order
    let orderBy;
    switch (sort) {
      case 'price_asc':
        orderBy = asc(products.price);
        break;
      case 'price_desc':
        orderBy = desc(products.price);
        break;
      case 'name':
        orderBy = asc(products.name);
        break;
      default:
        orderBy = desc(products.createdAt);
    }

    // Get products and total count
    const [productList, [{ count }]] = await Promise.all([
      db.query.products.findMany({
        where: and(...conditions),
        limit: limitNum,
        offset,
        orderBy,
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...conditions)),
    ]);

    return reply.send({
      success: true,
      data: {
        products: productList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: Number(count),
          totalPages: Math.ceil(Number(count) / limitNum),
        },
      },
    });
  });

  // Get product by ID
  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product || !product.isActive) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
      });
    }

    return reply.send({
      success: true,
      data: product,
    });
  });

  // Get product by slug
  server.get('/slug/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!product || !product.isActive) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
      });
    }

    return reply.send({
      success: true,
      data: product,
    });
  });

  // Get featured products
  server.get('/featured/list', async (request, reply) => {
    const featuredProducts = await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        eq(products.isFeatured, true)
      ),
      limit: 8,
      orderBy: desc(products.createdAt),
    });

    return reply.send({
      success: true,
      data: featuredProducts,
    });
  });

  // Create product (Admin only)
  server.post('/', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    try {
      const body = createProductSchema.parse(request.body);

      const slug = slugify(`${body.brand}-${body.name}-${body.model}`);

      const [product] = await db.insert(products).values({
        ...body,
        slug,
        price: body.price.toString(),
      }).returning();

      return reply.code(201).send({
        success: true,
        data: product,
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

  // Update product (Admin only)
  server.put('/:id', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = createProductSchema.partial().parse(request.body);

      const existing = await db.query.products.findFirst({
        where: eq(products.id, id),
      });

      if (!existing) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: 'Product not found',
          },
        });
      }

      let updateData: any = { ...body };
      
      if (body.price) {
        updateData.price = body.price.toString();
      }

      if (body.name || body.brand || body.model) {
        const slug = slugify(`${body.brand || existing.brand}-${body.name || existing.name}-${body.model || existing.model}`);
        updateData.slug = slug;
      }

      updateData.updatedAt = new Date();

      const [updated] = await db.update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      return reply.send({
        success: true,
        data: updated,
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

  // Delete product (Admin only)
  server.delete('/:id', {
    preHandler: requireAdmin,
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!existing) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
      });
    }

    // Soft delete
    await db.update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));

    return reply.send({
      success: true,
      data: {
        message: 'Product deleted successfully',
      },
    });
  });
}
