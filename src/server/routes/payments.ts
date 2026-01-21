import { FastifyInstance } from 'fastify';

export default async function paymentRoutes(server: FastifyInstance) {
  // M-Pesa callback
  server.post('/mpesa/callback', async (request, reply) => {
    // Handle M-Pesa Daraja API callback
    // Update order payment status
    server.log.info('M-Pesa callback received', request.body);

    return reply.send({
      success: true,
      data: {
        message: 'Callback received',
      },
    });
  });

  // Stripe webhook
  server.post('/card/webhook', async (request, reply) => {
    // Handle Stripe webhook
    // Update order payment status
    server.log.info('Stripe webhook received', request.body);

    return reply.send({
      success: true,
      data: {
        message: 'Webhook received',
      },
    });
  });

  // Check payment status
  server.get('/:orderId/status', async (request, reply) => {
    const { orderId } = request.params as { orderId: string };

    // TODO: Check payment status with provider

    return reply.send({
      success: true,
      data: {
        orderId,
        status: 'pending',
      },
    });
  });
}
