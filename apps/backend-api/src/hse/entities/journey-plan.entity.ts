import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../users/entities/user.entity';

export enum JourneyStatus {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

@Entity()
export class JourneyPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vehicle)
    vehicle: Vehicle;

    @ManyToOne(() => User)
    driver: User;

    @Column()
    routeOrigin: string;

    @Column()
    routeDestination: string;

    @Column({ type: 'jsonb' })
    riskFactors: any;

    @Column({
        type: 'enum',
        enum: JourneyStatus,
        default: JourneyStatus.PENDING_APPROVAL
    })
    status: JourneyStatus;

    @ManyToOne(() => User, { nullable: true })
    approvedBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
