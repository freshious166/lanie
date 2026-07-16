import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaystackService } from './paystack.service';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Invoice } from './entities/invoice.entity';
import { LedgerEntry } from './entities/ledger-entry.entity';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Subscription, SubscriptionPlan, Invoice, LedgerEntry])
    ],
    providers: [PaystackService, BillingService],
    controllers: [BillingController],
    exports: [BillingService]
})
export class BillingModule {}
