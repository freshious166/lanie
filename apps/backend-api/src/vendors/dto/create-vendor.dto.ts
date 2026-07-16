import {
    IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString,
    IsBoolean, IsNumber, IsArray, Min, Max,
} from 'class-validator';
import { VendorCategory } from '../entities/vendor.entity';

export class CreateVendorDto {
    @IsNotEmpty()
    @IsString()
    businessName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    whatsappNumber?: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    landmark?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsEnum(VendorCategory)
    category?: VendorCategory;

    @IsOptional()
    @IsBoolean()
    is24Hours?: boolean;

    @IsOptional()
    @IsString()
    openingTime?: string;

    @IsOptional()
    @IsString()
    closingTime?: string;

    @IsOptional()
    @IsArray()
    workingDays?: string[];

    @IsOptional()
    @IsString()
    cacRegistrationNumber?: string;

    @IsOptional()
    @IsString()
    tinNumber?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsOptional()
    @IsString()
    bannerUrl?: string;
}
