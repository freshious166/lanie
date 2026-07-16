import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../users/entities/tenant.entity';

@Entity()
export class TripLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @ManyToOne(() => Vehicle)
    vehicle: Vehicle;

    @ManyToOne(() => User)
    driver: User;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    distanceKm: number;

    @Column({ type: 'jsonb', nullable: true })
    startLocation: any;

    @Column({ type: 'jsonb', nullable: true })
    endLocation: any;

    @Column({ default: 'IN_PROGRESS' }) // e.g. IN_PROGRESS, COMPLETED, CANCELLED
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
