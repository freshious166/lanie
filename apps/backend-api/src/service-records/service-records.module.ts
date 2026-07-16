import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRecord } from './entities/service-record.entity';
import { ServiceRecordsController } from './service-records.controller';
import { ServiceRecordsService } from './service-records.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceRecord])],
    controllers: [ServiceRecordsController],
    providers: [ServiceRecordsService],
    exports: [ServiceRecordsService]
})
export class ServiceRecordsModule {}
