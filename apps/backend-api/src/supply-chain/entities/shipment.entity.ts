import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Tenant } from '../../users/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';

export enum ShipmentStatus {
    CREATED = 'CREATED',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    EXCEPTION = 'EXCEPTION' // Delayed, Temperature Breach, etc.
}

@Entity()
export class Shipment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @Column()
    trackingNumber: string;

    @ManyToOne(() => Vehicle, { nullable: true })
    vehicle: Vehicle; // Can change if multiple legs

    @ManyToOne(() => User, { nullable: true })
    assignedDriver: User;

    @Column({ type: 'jsonb' })
    origin: any; // { address, lat, lng }

    @Column({ type: 'jsonb' })
    destination: any; // { address, lat, lng, contactInfo }

    @Column({
        type: 'enum',
        enum: ShipmentStatus,
        default: ShipmentStatus.CREATED
    })
    status: ShipmentStatus;

    @Column({ type: 'jsonb', nullable: true })
    temperatureLogs: any[]; // e.g., [{ timestamp, temp: -18.5 }]

    @Column({ nullable: true })
    podSignatureUrl: string; // Proof of Delivery

    @Column({ nullable: true })
    podPhotoUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
