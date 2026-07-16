import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { KycService } from './kyc.service';

@Controller('marketplace')
export class MarketplaceController {
    constructor(
        private readonly jobsService: JobsService,
        private readonly kycService: KycService
    ) {}

    // Jobs endpoints
    @Post('jobs')
    createJob(@Body() body: { requesterId: string, vehicleId: string, vendorId: string, notes: string }) {
        return this.jobsService.createJob(body.requesterId, body.vehicleId, body.vendorId, body.notes);
    }

    @Put('jobs/:id/quote')
    submitQuote(@Param('id') id: string, @Body() body: { vendorId: string, partsCost: number, laborCost: number, notes: string }) {
        return this.jobsService.submitQuote(id, body.vendorId, body.partsCost, body.laborCost, body.notes);
    }

    @Put('jobs/:id/accept')
    acceptQuote(@Param('id') id: string, @Body() body: { requesterId: string }) {
        return this.jobsService.acceptQuote(id, body.requesterId);
    }

    @Put('jobs/:id/complete')
    completeJob(@Param('id') id: string, @Body() body: { vendorId: string }) {
        return this.jobsService.completeJob(id, body.vendorId);
    }

    // KYC endpoints
    @Post('kyc/:vendorId')
    submitKyc(@Param('vendorId') vendorId: string, @Body() body: { cacDocumentUrl: string, idDocumentUrl: string, addressProofUrl: string }) {
        return this.kycService.submitKyc(vendorId, body);
    }

    @Put('kyc/:vendorId/verify')
    verifyVendor(@Param('vendorId') vendorId: string, @Body() body: { adminId: string, isApproved: boolean }) {
        return this.kycService.verifyVendor(vendorId, body.adminId, body.isApproved);
    }
}
