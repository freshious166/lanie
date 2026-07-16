import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequest, ServiceStatus } from './entities/service-request.entity';

@Injectable()
export class ServiceRequestsService {
    constructor(
        @InjectRepository(ServiceRequest)
        private repo: Repository<ServiceRequest>,
    ) { }

    create(createDto: CreateServiceRequestDto, userId: string) {
        const request = this.repo.create({
            ...createDto,
            requester: { id: userId }, // Link to user
            status: ServiceStatus.PENDING,
        });
        return this.repo.save(request);
    }

    findAll() {
        return this.repo.find({ relations: ['requester', 'vehicle'] });
    }

    async findOne(id: string) {
        const req = await this.repo.findOne({ where: { id }, relations: ['requester', 'vehicle'] });
        if (!req) throw new NotFoundException('Service Request not found');
        return req;
    }

    async update(id: string, updateDto: UpdateServiceRequestDto) {
        const request = await this.repo.preload({
            id: id,
            ...updateDto,
        });
        if (!request) {
            throw new NotFoundException(`Service Request #${id} not found`);
        }
        return this.repo.save(request);
    }

    async remove(id: string) {
        const request = await this.findOne(id);
        return this.repo.remove(request);
    }
}
