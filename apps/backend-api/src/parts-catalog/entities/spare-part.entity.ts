import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Supplier } from './supplier.entity';

export enum PartCategory {
    ENGINE = 'ENGINE',
    TRANSMISSION = 'TRANSMISSION',
    BRAKES = 'BRAKES',
    SUSPENSION = 'SUSPENSION',
    ELECTRICAL = 'ELECTRICAL',
    BODY = 'BODY',
    FLUIDS = 'FLUIDS',
    TIRES = 'TIRES',
    OTHER = 'OTHER'
}

@Entity('spare_parts')
export class SparePart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    partNumber: string;

    @Column({ type: 'enum', enum: PartCategory, default: PartCategory.OTHER })
    category: PartCategory;

    @Column({ type: 'simple-array', nullable: true })
    compatibleVehicles: string[]; // e.g. ["Toyota Hilux 2018-2022", "Toyota Hiace"]

    @ManyToOne(() => Supplier, (supplier) => supplier.parts, { nullable: true })
    supplier: Supplier;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    price: number;

    @Column({ default: false })
    isGenuine: boolean;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
