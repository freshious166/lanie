import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobDispute, DisputeStatus } from './entities/job-dispute.entity';

@Injectable()
export class JobDisputesService {
    constructor(
        @InjectRepository(JobDispute)
        private disputeRepository: Repository<JobDispute>
    ) {}

    async getDisputes() {
        return this.disputeRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['customer', 'vendor']
        });
    }

    async resolveDispute(id: string, resolution: DisputeStatus, notes: string) {
        const dispute = await this.disputeRepository.findOne({ where: { id } });
        if (!dispute) throw new NotFoundException('Dispute not found');

        dispute.status = resolution;
        dispute.resolutionNotes = notes;
        return this.disputeRepository.save(dispute);
    }

    async seedDemoData() {
        if (await this.disputeRepository.count() === 0) {
            await this.disputeRepository.save([
                this.disputeRepository.create({
                    jobId: 'JOB-9923',
                    reason: 'Mechanic used substandard parts, car broke down after 2 days.',
                    status: DisputeStatus.OPEN
                }),
                this.disputeRepository.create({
                    jobId: 'JOB-9910',
                    reason: 'Overcharged for towing service, was quoted 20k but billed 50k.',
                    status: DisputeStatus.IN_REVIEW
                })
            ]);
        }
        return { success: true };
    }
}
