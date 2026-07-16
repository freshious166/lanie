import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SubscriptionTier {
    STARTER = 'STARTER',
    PROFESSIONAL = 'PROFESSIONAL',
    ENTERPRISE = 'ENTERPRISE',
    ROADSIDE = 'ROADSIDE' // specialized tier
}

@Entity('subscription_plans')
export class SubscriptionPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: SubscriptionTier })
    tier: SubscriptionTier;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    priceMonthly: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    priceAnnually: number;

    @Column({ type: 'jsonb' })
    features: any; // e.g. { maxVehicles: 10, advancedAnalytics: false }

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 'NGN' })
    currency: string; // Enables region-specific pricing plans

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
