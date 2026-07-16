import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Tenant } from './tenant.entity';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    FLEET_MANAGER = 'FLEET_MANAGER',
    DISPATCHER = 'DISPATCHER',
    TECHNICIAN = 'TECHNICIAN',
    DRIVER = 'DRIVER',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.FLEET_MANAGER })
    role: UserRole;

    @ManyToOne(() => Tenant, tenant => tenant.users, { nullable: true })
    tenant: Tenant;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
