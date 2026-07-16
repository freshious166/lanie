import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { Vendor } from './entities/vendor.entity';
import { VendorService as VendorServiceEntity } from './entities/vendor-service.entity';
import { VendorReview } from './entities/vendor-review.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vendor, VendorServiceEntity, VendorReview]),
    ],
    controllers: [VendorsController],
    providers: [VendorsService],
    exports: [VendorsService],
})
export class VendorsModule { }
