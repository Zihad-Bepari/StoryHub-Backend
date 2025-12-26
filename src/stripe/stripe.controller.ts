// stripe.controller.ts
import { Body, Controller, Post, Get, Param, BadRequestException, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiTags, ApiBody, ApiResponse, ApiParam, ApiProperty } from '@nestjs/swagger';

class CreatePaymentDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email for payment' })
  email: string;
}

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-intent')
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  @ApiResponse({ status: 400, description: 'Email is missing or invalid' })
  async create(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    return this.stripeService.createPaymentIntent(email);
  }

  @Get('status/:paymentIntentId')
  @ApiParam({ name: 'paymentIntentId', description: 'Stripe Payment Intent ID', example: 'pi_123456789' })
  @ApiResponse({ status: 200, description: 'Payment status retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid paymentIntentId' })
  async status(@Param('paymentIntentId') paymentIntentId: string) {
    return this.stripeService.confirmPaymentStatus(paymentIntentId);
  }

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
                amount: { type: 'number', example: 500 },
                currency: { type: 'string', example: 'usd' },
                metadata: { type: 'object', example: { email: 'user@example.com' } },
              },
            },
          },
        },
      },
      required: ['type', 'data'],
    },
  })
  @ApiResponse({ status: 200, description: 'Webhook received successfully' })
  @ApiResponse({ status: 400, description: 'Invalid event payload' })
  async webhook(@Req() req: any) {
    const event = req.body;
    if (!event || !event.type) throw new BadRequestException('Invalid event');

    return this.stripeService.handleWebhook(event);
  }
}
