import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    ParseFloatPipe,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorServiceDto } from './dto/create-vendor-service.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('vendors')
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @Post()
    create(@Body() createVendorDto: CreateVendorDto) {
        return this.vendorsService.create(createVendorDto);
    }

    @Get()
    findAll(
        @Query('state') state?: string,
        @Query('city') city?: string,
        @Query('category') category?: string,
        @Query('isVerified') isVerified?: string,
        @Query('search') search?: string,
    ) {
        return this.vendorsService.findAll({
            state,
            city,
            category,
            isVerified: isVerified === 'true' ? true : isVerified === 'false' ? false : undefined,
            search,
        });
    }

    @Get('nearby')
    findNearby(
        @Query('lat', ParseFloatPipe) lat: number,
        @Query('lng', ParseFloatPipe) lng: number,
        @Query('radius', ParseFloatPipe) radius?: number,
    ) {
        return this.vendorsService.findNearby(lat, lng, radius);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.vendorsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateVendorDto: UpdateVendorDto,
    ) {
        return this.vendorsService.update(id, updateVendorDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.vendorsService.remove(id);
    }

    // ── Vendor Services ───────────────────────────────────────────────────────

    @Post(':id/services')
    addService(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: CreateVendorServiceDto,
    ) {
        return this.vendorsService.addService(id, dto);
    }

    @Delete(':id/services/:serviceId')
    removeService(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('serviceId', ParseUUIDPipe) serviceId: string,
    ) {
        return this.vendorsService.removeService(id, serviceId);
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    @Post(':id/reviews')
    addReview(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: CreateReviewDto,
        @Body('reviewerId') reviewerId: string, // Temporary until Auth is fully wired
    ) {
        return this.vendorsService.addReview(id, reviewerId, dto);
    }

    @Get(':id/reviews')
    getReviews(@Param('id', ParseUUIDPipe) id: string) {
        return this.vendorsService.getReviews(id);
    }
}
