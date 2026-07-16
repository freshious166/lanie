import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Get('plans')
    getPlans() {
        return this.billingService.getPlans();
    }

    @Post('subscribe')
    subscribe(@Body() body: { userId: string, email: string, planId: string }) {
        return this.billingService.subscribeUser(body.userId, body.email, body.planId);
    }
}
