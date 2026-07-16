import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';

@Injectable()
export class SupplyChainService {
    constructor(
        @InjectRepository(Shipment)
        private shipmentRepository: Repository<Shipment>
    ) {}

    async create(createShipmentDto: any) {
        const shipment = this.shipmentRepository.create(createShipmentDto);
        return this.shipmentRepository.save(shipment);
    }

    async findAll() {
        return this.shipmentRepository.find({ order: { createdAt: 'DESC' } });
    }
}
