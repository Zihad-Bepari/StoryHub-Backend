import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not set');
    this.stripe = new Stripe(key, { apiVersion: '2025-12-15.clover' });
  }

  getStripe() {
    return this.stripe;
  }

  async createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in cents
      currency: 'usd',
      metadata: {},
    });
  }
}
