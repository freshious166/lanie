import { Controller, Get, Post } from '@nestjs/common';
import { HseService } from './hse.service';

@Controller('hse')
export class HseController {
    constructor(private readonly hseService: HseService) {}

    @Get('compliance')
    async getComplianceData() {
        return this.hseService.getComplianceOverview();
    }

    @Post('seed')
    async seedHseData() {
        return this.hseService.seedDemoData();
    }
}
