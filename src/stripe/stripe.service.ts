// stripe.service.ts
import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentStatus } from 'generated/prisma/enums';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService
  ) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY missing');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createPaymentIntent(email: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 500, // $5
        currency: 'usd',
        receipt_email: email,
        metadata: { product: 'STORYHUB_PREMIUM', email },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  async confirmAndSavePayment(paymentIntentId: string) {
  try {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const paymentDetails = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      email: paymentIntent.metadata?.email || 'unknown',
      payment_method: paymentIntent.payment_method,
      created: new Date(paymentIntent.created * 1000),
      description: paymentIntent.description,
    };

    await this.prisma.client.payment.upsert({
      where: { stripePaymentId: paymentIntent.id },
      update: { status: paymentIntent.status.toUpperCase() as PaymentStatus}, 
      create: {
        userId: paymentDetails.email,
        stripePaymentId: paymentIntent.id,
        amount: paymentDetails.amount,
        status: paymentIntent.status.toUpperCase() as PaymentStatus,
      },
    });

    return paymentDetails;
  } catch (err: any) {
    console.error('❌ Error confirming payment:', err.message);
    throw new BadRequestException(err.message);
  }
}


   async handleWebhook(rawBody: Buffer, sig: string, endpointSecret: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
      console.error('⚠️ Webhook signature verification failed.', err.message);
      throw new Error('Invalid signature');
    }

    const paymentData = event.data?.object as Stripe.PaymentIntent;
    
    console.log(paymentData);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Payment succeeded:', paymentData.id);

        await this.prisma.client.payment.upsert({
          where: { stripePaymentId: paymentData.id },
          update: { status: PaymentStatus.SUCCEEDED },
          create: {
            userId: paymentData.metadata?.email || 'unknown',
            stripePaymentId: paymentData.id,
            amount: paymentData.amount / 100, 
            status: PaymentStatus.SUCCEEDED,
          },
        });
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', paymentData.id);

        await this.prisma.client.payment.upsert({
          where: { stripePaymentId: paymentData.id },
          update: { status: PaymentStatus.FAILED },
          create: {
            userId: paymentData.metadata?.email || 'unknown',
            stripePaymentId: paymentData.id,
            amount: paymentData.amount / 100,
            status: PaymentStatus.FAILED,
          },
        });
        break;

      default:
        console.log('⚠️ Unhandled event type:', event.type);
    }

    return { received: true };
  }
}
 