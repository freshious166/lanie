import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../users/entities/tenant.entity';

export enum IncidentStatus {
    OPEN = 'OPEN',
    INVESTIGATING = 'INVESTIGATING',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

@Entity()
export class IncidentReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @ManyToOne(() => Vehicle, { nullable: true })
    vehicle: Vehicle;

    @ManyToOne(() => User, { nullable: true })
    reporter: User;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: IncidentStatus,
        default: IncidentStatus.OPEN
    })
    status: IncidentStatus;

    @Column({ type: 'text', nullable: true })
    rootCauseCategory: string; // e.g., HUMAN_ERROR, MECHANICAL_FAILURE

    @Column({ type: 'text', nullable: true })
    correctiveAction: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
