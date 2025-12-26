// payment.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeModule } from '@/stripe/stripe.module';

@Module({
  imports: [forwardRef(() => StripeModule)],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
