import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { LedgerEntry, LedgerStatus } from './entities/ledger-entry.entity';
import { PaystackService } from './paystack.service';

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        @InjectRepository(SubscriptionPlan)
        private planRepository: Repository<SubscriptionPlan>,
        @InjectRepository(LedgerEntry)
        private ledgerRepository: Repository<LedgerEntry>,
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

    async getDashboardMetrics() {
        // Calculate MRR (Monthly Recurring Revenue)
        const activeSubs = await this.subscriptionRepository.find({
            where: { status: SubscriptionStatus.ACTIVE },
            relations: ['plan']
        });
        const mrr = activeSubs.reduce((acc, sub) => acc + Number(sub.plan.priceMonthly), 0);

        // Calculate pending payouts
        const pendingLedgers = await this.ledgerRepository.find({ where: { status: LedgerStatus.PENDING } });
        const pendingPayouts = pendingLedgers.reduce((acc, entry) => acc + Number(entry.netPayout), 0);

        // Calculate total commission earned
        const paidLedgers = await this.ledgerRepository.find({ where: { status: LedgerStatus.PAID } });
        const commissionEarned = paidLedgers.reduce((acc, entry) => acc + Number(entry.commissionAmount), 0);

        // Get ledger history
        const ledgerHistory = await this.ledgerRepository.find({
            order: { createdAt: 'DESC' },
            take: 10,
            relations: ['vendor']
        });

        return {
            mrr,
            pendingPayouts,
            commissionEarned,
            ledgerHistory: ledgerHistory.map(l => ({
                id: l.id,
                vendorName: l.vendor?.businessName || 'Unknown Vendor',
                gross: l.grossAmount,
                commission: l.commissionAmount,
                net: l.netPayout,
                status: l.status,
                date: l.createdAt
            }))
        };
    }

    async seedDemoData() {
        // Seed MRR (Subscription)
        if (await this.subscriptionRepository.count() === 0) {
            const plan = this.planRepository.create({
                name: 'Enterprise Fleet',
                tier: 'ENTERPRISE' as any,
                priceMonthly: 2400000, // 2.4M
                priceAnnually: 24000000,
                features: {}
            });
            await this.planRepository.save(plan);

            await this.subscriptionRepository.save({
                plan,
                status: SubscriptionStatus.ACTIVE
            });
        }

        // Seed Ledger
        if (await this.ledgerRepository.count() === 0) {
            await this.ledgerRepository.save([
                this.ledgerRepository.create({
                    grossAmount: 500000,
                    commissionAmount: 50000,
                    netPayout: 450000,
                    status: LedgerStatus.PENDING
                }),
                this.ledgerRepository.create({
                    grossAmount: 444444.44,
                    commissionAmount: 44444.44,
                    netPayout: 400000,
                    status: LedgerStatus.PENDING
                }),
                this.ledgerRepository.create({
                    grossAmount: 4500000,
                    commissionAmount: 450000,
                    netPayout: 4050000,
                    status: LedgerStatus.PAID
                })
            ]);
        }
        return { success: true };
    }
}
