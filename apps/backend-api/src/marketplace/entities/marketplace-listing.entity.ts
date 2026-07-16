import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Tenant } from '../../users/entities/tenant.entity';

export enum ListingStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    DELISTED = 'DELISTED'
}

@Entity()
export class MarketplaceListing {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Tenant)
    seller: Tenant;

    @OneToOne(() => Vehicle)
    @JoinColumn()
    vehicle: Vehicle;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    askingPrice: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    estimatedValuation: number; // Transparent rules-based valuation

    @Column({ default: false })
    isCertifiedPreOwned: boolean; // True if verified service history + no compliance flags

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ListingStatus,
        default: ListingStatus.DRAFT
    })
    status: ListingStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
