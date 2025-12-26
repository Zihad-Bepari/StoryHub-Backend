import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { StripeService } from '@/stripe/stripe.service';
import { PaymentStatus } from 'generated/prisma/enums';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
  ) {}

  // Create payment
  async createPayment(userId: string, amount: number) {
    // Stripe payment intent
    const paymentIntent = await this.stripeService.createPaymentIntent(amount);

    // Save payment in DB
    const payment = await this.prisma.client.payment.create({
      data: {
        userId,
        stripePaymentId: paymentIntent.id,
        amount,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      amount: payment.amount,
      status: payment.status,
    };
  }

  // Update payment status safely
  async updatePaymentStatus(stripePaymentId: string, status: PaymentStatus) {
    const payment = await this.prisma.client.payment.findUnique({
      where: { stripePaymentId },
    });

    if (!payment) {
      console.warn(`Payment not found for id ${stripePaymentId}`);
      return null;
    }

    return this.prisma.client.payment.update({
      where: { stripePaymentId },
      data: { status },
    });
  }
}
