import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { JobDisputesService } from './job-disputes.service';
import { DisputeStatus } from './entities/job-dispute.entity';

@Controller('job-disputes')
export class JobDisputesController {
  constructor(private readonly disputesService: JobDisputesService) {}

  @Get()
  findAll() {
    return this.disputesService.getDisputes();
  }

  @Put(':id/resolve')
  resolve(@Param('id') id: string, @Body() body: { status: DisputeStatus, notes: string }) {
    return this.disputesService.resolveDispute(id, body.status, body.notes);
  }

  @Post('seed')
  seedData() {
    return this.disputesService.seedDemoData();
  }
}
