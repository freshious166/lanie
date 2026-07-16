import {
    IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min,
} from 'class-validator';

export class CreateVendorServiceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    priceKobo?: number;   // Price in kobo (100 kobo = ₦1)

    @IsOptional()
    @IsInt()
    @Min(1)
    estimatedDurationMinutes?: number;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}
