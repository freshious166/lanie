import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { MaintenanceJob } from '../../maintenance-jobs/entities/maintenance-job.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

export enum InvoiceStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE'
}

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => MaintenanceJob)
    job: MaintenanceJob;

    @ManyToOne(() => Vendor)
    vendor: Vendor;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    partsCost: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    laborCost: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    commissionAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalAmount: number;

    @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
    status: InvoiceStatus;

    @Column({ nullable: true })
    pdfUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
