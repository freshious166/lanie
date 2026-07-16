import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

export enum JobStatus {
    REQUESTED = 'REQUESTED',
    QUOTED = 'QUOTED',
    ACCEPTED = 'ACCEPTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    INVOICED = 'INVOICED',
    PAID = 'PAID',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED'
}

@Entity('maintenance_jobs')
export class MaintenanceJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    requester: User;

    @ManyToOne(() => Vendor, { nullable: true })
    vendor: Vendor;

    @ManyToOne(() => Vehicle)
    vehicle: Vehicle;

    @Column({ type: 'enum', enum: JobStatus, default: JobStatus.REQUESTED })
    status: JobStatus;

    @Column({ type: 'text', nullable: true })
    customerNotes: string;

    @Column({ type: 'text', nullable: true })
    vendorNotes: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    quoteAmountParts: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    quoteAmountLabor: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    totalQuoteAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
