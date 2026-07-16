import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../users/entities/tenant.entity';

@Entity()
export class RiskAssessment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    driver: User;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    score: number; // e.g., 0-100

    @Column({ type: 'jsonb', nullable: true })
    factors: any; // Break down of score (speeding, harsh braking, etc.)

    @Column({ type: 'text', nullable: true })
    assessorNotes: string;

    @CreateDateColumn()
    assessedAt: Date;
}
