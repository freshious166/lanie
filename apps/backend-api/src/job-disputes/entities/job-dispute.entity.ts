import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

export enum DisputeStatus {
    OPEN = 'OPEN',
    IN_REVIEW = 'IN_REVIEW',
    RESOLVED_CUSTOMER = 'RESOLVED_CUSTOMER',
    RESOLVED_VENDOR = 'RESOLVED_VENDOR',
    REFUNDED = 'REFUNDED'
}

@Entity('job_disputes')
export class JobDispute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    jobId: string;

    @ManyToOne(() => User)
    customer: User;

    @ManyToOne(() => Vendor)
    vendor: Vendor;

    @Column({ type: 'text' })
    reason: string;

    @Column({
        type: 'enum',
        enum: DisputeStatus,
        default: DisputeStatus.OPEN
    })
    status: DisputeStatus;

    @Column({ type: 'text', nullable: true })
    resolutionNotes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
