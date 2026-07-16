import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VendorService } from './vendor-service.entity';
import { VendorReview } from './vendor-review.entity';

export enum VendorStatus {
    PENDING = 'PENDING',       // Awaiting admin verification
    VERIFIED = 'VERIFIED',     // Active & visible to users
    SUSPENDED = 'SUSPENDED',   // Temporarily disabled
    REJECTED = 'REJECTED',     // Rejected during vetting
    DEACTIVATED = 'DEACTIVATED', // Partner left the platform
}

export enum VendorCategory {
    GENERAL_MECHANIC = 'GENERAL_MECHANIC',
    BODY_SHOP = 'BODY_SHOP',
    TOWING = 'TOWING',
    TIRE_SHOP = 'TIRE_SHOP',
    ELECTRICAL = 'ELECTRICAL',
    DIAGNOSTICS = 'DIAGNOSTICS',
    FUEL_DELIVERY = 'FUEL_DELIVERY',
    DEALERSHIP = 'DEALERSHIP',
}

@Entity('vendors')
export class Vendor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // ── Identity ──────────────────────────────────────────────────────────────
    @Column()
    businessName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ nullable: true })
    bannerUrl: string;

    // ── Owner / Account ───────────────────────────────────────────────────────
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Column({ nullable: true })
    ownerId: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phoneNumber: string;

    @Column({ nullable: true })
    whatsappNumber: string;

    // ── Location ──────────────────────────────────────────────────────────────
    @Column()
    address: string;

    @Column({ nullable: true })
    landmark: string;

    @Column({ nullable: true })
    city: string;

    @Column({ default: 'Lagos' })
    state: string;

    @Column({ default: 'Nigeria' })
    country: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: any;

    // ── Classification ────────────────────────────────────────────────────────
    @Column({ type: 'enum', enum: VendorCategory, default: VendorCategory.GENERAL_MECHANIC })
    primaryCategory: VendorCategory;

    @Column({ type: 'simple-array', nullable: true })
    serviceCategories: VendorCategory[];

    @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.PENDING })
    status: VendorStatus;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: false })
    is24Hours: boolean;

    // ── Business Hours ────────────────────────────────────────────────────────
    @Column({ nullable: true })
    openingTime: string;   // e.g. "08:00"

    @Column({ nullable: true })
    closingTime: string;   // e.g. "18:00"

    @Column({ type: 'simple-array', nullable: true })
    workingDays: string[]; // e.g. ["Mon","Tue","Wed","Thu","Fri","Sat"]

    @Column({ type: 'int', default: 20 })
    serviceRadiusKm: number;

    // ── Rating (denormalized for fast reads) ──────────────────────────────────
    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    averageRating: number;

    @Column({ default: 0 })
    totalReviews: number;

    // ── Relations ─────────────────────────────────────────────────────────────
    @OneToMany(() => VendorService, (service) => service.vendor, { cascade: true })
    services: VendorService[];

    @OneToMany(() => VendorReview, (review) => review.vendor, { cascade: true })
    reviews: VendorReview[];

    // ── Compliance ────────────────────────────────────────────────────────────
    @Column({ nullable: true })
    cacRegistrationNumber: string;   // Corporate Affairs Commission (Nigeria)

    @Column({ nullable: true })
    tinNumber: string;               // Tax Identification Number

    @Column({ nullable: true })
    cacDocumentUrl: string;

    @Column({ nullable: true })
    idDocumentUrl: string;

    @Column({ nullable: true })
    addressProofUrl: string;

    @Column({ type: 'timestamp', nullable: true })
    verifiedAt: Date;

    @Column({ nullable: true })
    verifiedBy: string;              // Admin user ID who verified

    // ── Timestamps ────────────────────────────────────────────────────────────
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
