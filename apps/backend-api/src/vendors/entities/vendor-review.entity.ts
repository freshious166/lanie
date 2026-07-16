import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { User } from '../../users/entities/user.entity';

@Entity('vendor_reviews')
export class VendorReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor, (vendor) => vendor.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor: Vendor;

    @Column()
    vendorId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'reviewerId' })
    reviewer: User;

    @Column({ nullable: true })
    reviewerId: string;

    @Column({ type: 'int' })
    rating: number;  // 1–5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ default: false })
    isVerifiedVisit: boolean;  // True if reviewer has a confirmed service request

    @CreateDateColumn()
    createdAt: Date;
}
