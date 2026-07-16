import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Tenant } from '../../users/entities/tenant.entity';
import { RegulatoryBody } from './regulatory-body.entity';

@Entity()
export class ComplianceDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @ManyToOne(() => Vehicle, { nullable: true })
    vehicle: Vehicle;

    @ManyToOne(() => RegulatoryBody)
    regulatoryBody: RegulatoryBody;

    @Column()
    documentName: string; // e.g., Roadworthiness Certificate

    @Column()
    documentUrl: string;

    @Column({ type: 'date' })
    issuedAt: Date;

    @Column({ type: 'date' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
