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

    async seedDemoData() {
        if (await this.shipmentRepository.count() === 0) {
            await this.shipmentRepository.save([
                this.shipmentRepository.create({
                    trackingNumber: 'TRK-9008234-A',
                    origin: { contactInfo: 'Nestlé Distribution', address: 'Agbara Estate, Ogun' },
                    destination: { address: 'Shoprite Ikeja City Mall' },
                    status: 'IN_TRANSIT',
                    temperatureLogs: [{ temp: -18.2, status: 'Optimal' }]
                }),
                this.shipmentRepository.create({
                    trackingNumber: 'TRK-9008235-B',
                    origin: { contactInfo: 'Pfizer Vaccines', address: 'Murtala Muhammed Airport' },
                    destination: { address: 'Lagos University Teaching Hospital' },
                    status: 'EXCEPTION',
                    temperatureLogs: [{ temp: -5.4, status: 'Temperature Deviation Warning' }]
                })
            ]);
        }
        return { success: true, message: 'Shipment data seeded' };
    }
}
