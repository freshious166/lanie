import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

export enum ServiceType {
    MAINTENANCE = 'MAINTENANCE',
    ROADSIDE_ASSISTANCE = 'ROADSIDE_ASSISTANCE',
    INSPECTION = 'INSPECTION',
}

export enum ServiceStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Entity()
export class ServiceRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    requester: User;

    @ManyToOne(() => Vehicle, { nullable: true })
    vehicle: Vehicle;

    @Column({ type: 'enum', enum: ServiceType })
    type: ServiceType;

    @Column({ type: 'enum', enum: ServiceStatus, default: ServiceStatus.PENDING })
    status: ServiceStatus;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
