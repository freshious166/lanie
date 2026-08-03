import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobDisputesService } from './job-disputes.service';
import { JobDisputesController } from './job-disputes.controller';
import { JobDispute } from './entities/job-dispute.entity';
import { JobDisputesService } from './job-disputes.service';
import { JobDisputesController } from './job-disputes.controller';
import { JobDisputesController } from './job-disputes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobDispute])],
  controllers: [JobDisputesController],
  providers: [JobDisputesService],
})
export class JobDisputesModule {}
