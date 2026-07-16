import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('vendor_services')
export class VendorService {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor, (vendor) => vendor.services, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor: Vendor;

    @Column()
    vendorId: string;

    @Column()
    name: string;  // e.g. "Standard Oil Change"

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    icon: string;  // MaterialCommunityIcons name e.g. "oil-barrel"

    // Price stored in kobo (Nigerian lowest denomination) to avoid float issues
    @Column({ type: 'int', nullable: true })
    priceKobo: number;

    @Column({ nullable: true })
    priceCurrency: string;  // default 'NGN'

    @Column({ nullable: true })
    estimatedDurationMinutes: number;

    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
