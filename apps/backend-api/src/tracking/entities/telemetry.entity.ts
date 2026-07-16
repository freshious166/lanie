import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity()
export class Telemetry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vehicle)
    vehicle: Vehicle;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    location: any; // Using any for Point to avoid external dependencies in entity file directly, TypeORM handles it

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    speedKmh: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    heading: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    fuelLevel: number; // Percentage or absolute volume

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    odometer: number; // Accumulated distance in km

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    engineHours: number; // Accumulated engine running hours

    @Column({ nullable: true })
    eventType: string; // e.g., HARSH_BRAKING, SPEEDING, IDLING, RAPID_ACCEL

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @CreateDateColumn()
    createdAt: Date;
}
