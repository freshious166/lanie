import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { MaintenanceJob } from '../../maintenance-jobs/entities/maintenance-job.entity';

export enum LedgerStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    DISPUTED = 'DISPUTED'
}

@Entity('ledger_entries')
export class LedgerEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor)
    vendor: Vendor;

    @ManyToOne(() => MaintenanceJob)
    job: MaintenanceJob;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    grossAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    commissionAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    netPayout: number;

    @Column({ type: 'enum', enum: LedgerStatus, default: LedgerStatus.PENDING })
    status: LedgerStatus;

    @Column({ nullable: true })
    payoutReference: string; // e.g. from Paystack/Flutterwave Transfer

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
