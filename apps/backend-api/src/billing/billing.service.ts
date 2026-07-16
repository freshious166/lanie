import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { PaystackService } from './paystack.service';

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        @InjectRepository(SubscriptionPlan)
        private planRepository: Repository<SubscriptionPlan>,
        private paystackService: PaystackService
    ) {}

    async getPlans() {
        return this.planRepository.find({ where: { isActive: true } });
    }

    async subscribeUser(userId: string, email: string, planId: string) {
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan) throw new NotFoundException('Plan not found');

        // Mock initialization for Paystack
        const tx = await this.paystackService.initializeTransaction(email, plan.priceMonthly);

        const sub = this.subscriptionRepository.create({
            user: { id: userId } as any,
            plan,
            status: SubscriptionStatus.TRIALING
        });

        await this.subscriptionRepository.save(sub);

        return {
            subscriptionId: sub.id,
            authorizationUrl: tx.data.authorization_url,
            reference: tx.data.reference
        };
    }
}
