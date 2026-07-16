import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    companyName: string;

    @Column({ nullable: true })
    contactEmail: string;

    @Column({ nullable: true })
    contactPhone: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 'NGN' })
    currency: string; // ISO 4217, e.g. NGN, GHS, XOF

    @Column({ default: 'NG' })
    countryCode: string; // ISO 3166-1 alpha-2, e.g. NG, GH, CI

    @OneToMany(() => User, user => user.tenant)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
