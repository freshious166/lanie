import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { KycService } from './kyc.service';
import { MarketplaceController } from './marketplace.controller';
import { MaintenanceJob } from '../maintenance-jobs/entities/maintenance-job.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { MarketplaceListing } from './entities/marketplace-listing.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MaintenanceJob, Vendor, MarketplaceListing])
    ],
    providers: [JobsService, KycService],
    controllers: [MarketplaceController],
    exports: [JobsService, KycService]
})
export class MarketplaceModule {}
