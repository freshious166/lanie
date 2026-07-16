import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRecord } from './entities/service-record.entity';

@Injectable()
export class ServiceRecordsService {
    constructor(
        @InjectRepository(ServiceRecord)
        private serviceRecordRepository: Repository<ServiceRecord>
    ) {}

    async create(createDto: any) {
        const record = this.serviceRecordRepository.create(createDto);
        return this.serviceRecordRepository.save(record);
    }

    async findByVehicle(vehicleId: string) {
        return this.serviceRecordRepository.find({
            where: { vehicle: { id: vehicleId } },
            order: { serviceDate: 'DESC' }
        });
    }

    async findAll() {
        return this.serviceRecordRepository.find({ order: { serviceDate: 'DESC' } });
    }
}
