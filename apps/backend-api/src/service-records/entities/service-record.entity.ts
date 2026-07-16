import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { MaintenanceJob } from '../../maintenance-jobs/entities/maintenance-job.entity';

@Entity('service_records')
export class ServiceRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vehicle)
    vehicle: Vehicle;

    @ManyToOne(() => Vendor)
    vendor: Vendor;

    @ManyToOne(() => MaintenanceJob, { nullable: true })
    job: MaintenanceJob;

    @Column({ type: 'date' })
    serviceDate: string;

    @Column()
    serviceType: string;

    @Column({ type: 'int', nullable: true })
    mileageAtService: number;

    @Column({ type: 'jsonb', nullable: true })
    partsUsed: any; // e.g. [{ partId, name, quantity, cost }]

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalCost: number;

    @Column({ type: 'simple-array', nullable: true })
    photos: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
