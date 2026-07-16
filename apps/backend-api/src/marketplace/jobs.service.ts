import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceJob, JobStatus } from '../maintenance-jobs/entities/maintenance-job.entity';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(MaintenanceJob)
        private jobRepository: Repository<MaintenanceJob>
    ) {}

    async createJob(requesterId: string, vehicleId: string, vendorId: string, notes: string) {
        const job = this.jobRepository.create({
            requester: { id: requesterId } as any,
            vehicle: { id: vehicleId } as any,
            vendor: { id: vendorId } as any,
            customerNotes: notes,
            status: JobStatus.REQUESTED
        });
        return this.jobRepository.save(job);
    }

    async submitQuote(jobId: string, vendorId: string, partsCost: number, laborCost: number, notes: string) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, vendor: { id: vendorId } as any } });
        if (!job) throw new NotFoundException('Job not found or not assigned to this vendor');
        if (job.status !== JobStatus.REQUESTED) throw new BadRequestException('Can only quote requested jobs');

        job.quoteAmountParts = partsCost;
        job.quoteAmountLabor = laborCost;
        job.totalQuoteAmount = partsCost + laborCost;
        job.vendorNotes = notes;
        job.status = JobStatus.QUOTED;

        return this.jobRepository.save(job);
    }

    async acceptQuote(jobId: string, requesterId: string) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, requester: { id: requesterId } as any } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.status !== JobStatus.QUOTED) throw new BadRequestException('Can only accept quoted jobs');

        job.status = JobStatus.ACCEPTED;
        return this.jobRepository.save(job);
    }

    async completeJob(jobId: string, vendorId: string) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, vendor: { id: vendorId } as any } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.status !== JobStatus.ACCEPTED && job.status !== JobStatus.IN_PROGRESS) {
            throw new BadRequestException('Job is not in a valid state to complete');
        }

        job.status = JobStatus.COMPLETED;
        return this.jobRepository.save(job);
    }
}
