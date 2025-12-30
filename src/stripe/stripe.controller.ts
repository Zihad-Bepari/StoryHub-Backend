// stripe.controller.ts
import { Body, Controller, Post, Get,Headers, Param, BadRequestException, Req, Res } from '@nestjs/common';
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
    const ans = this.stripeService.confirmAndSavePayment(paymentIntentId);
    console.log(ans);
    return ans;
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
  async webhook(
    @Req() req: any,
    @Headers('Stripe-signature') sig: string,
    @Res() res:Response
  ) {
    
   const endpointSecret: string | undefined =
      process.env.STRIPE_WEBHOOK_SECRET_KEY;
    if (!endpointSecret) {
      throw new Error('Missing Stripe Webhook Secret!');
    }
  const rawBody: Buffer = req.body;     
  const result = await this.stripeService.handleWebhook(
      rawBody,
      sig,
      endpointSecret,
    );
    
    return result;
  }
}
