import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../users/entities/tenant.entity';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    vin: string;

    @Column()
    plateNumber: string;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column({ type: 'int' })
    year: number;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ default: 'Healthy' })
    status: string;

    @Column({ nullable: true })
    value: string;

    @Column({ type: 'int', nullable: true })
    nextServiceMileage: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    currentMileage: number; // Updated continually from telemetry

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    fuelCapacity: number; // In liters, used for anomaly calculations

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    maintenanceRiskScore: number; // 0-100 score, 100 being critical risk

    @ManyToOne(() => User, { nullable: true })
    owner: User;

    @ManyToOne(() => Tenant, { nullable: true })
    tenant: Tenant;

    @Column({ type: 'jsonb', nullable: true })
    serviceHistory: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
