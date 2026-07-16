import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    PAST_DUE = 'PAST_DUE',
    CANCELED = 'CANCELED',
    TRIALING = 'TRIALING'
}

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Assuming tenant level subscription, for now binding to user/tenant
    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => SubscriptionPlan)
    plan: SubscriptionPlan;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.TRIALING })
    status: SubscriptionStatus;

    @Column({ nullable: true })
    paystackSubscriptionCode: string;

    @Column({ nullable: true })
    paystackCustomerCode: string;

    @Column({ type: 'timestamp', nullable: true })
    currentPeriodStart: Date;

    @Column({ type: 'timestamp', nullable: true })
    currentPeriodEnd: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
