import { Controller, Post, Req, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { PaymentService } from '@/payment/payment.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private paymentService: PaymentService,
  ) {}

  @Post('webhook')
  @ApiBody({
    description: 'Stripe webhook payload',
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'payment_intent.succeeded' },
        data: {
          type: 'object',
          properties: {
            object: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'pi_123456789' },
                amount: { type: 'number', example: 1000 },
                currency: { type: 'string', example: 'usd' },
                metadata: { type: 'object', example: { userId: 'user_123' } },
              },
            },
          },
        },
      },
      required: ['type', 'data'],
    },
  })
  @ApiResponse({ status: 200, description: 'Webhook received successfully' })
  @ApiResponse({ status: 400, description: 'Invalid event' })
  async webhook(@Req() req: any) {
    const event = req.body;
    if (!event || !event.type) {
      throw new BadRequestException('Invalid event');
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.paymentService.updatePaymentStatus(paymentIntent.id, 'SUCCEEDED');
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.paymentService.updatePaymentStatus(paymentIntent.id, 'FAILED');
    }

    return { received: true };
  }
}
