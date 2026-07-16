import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupplyChainService } from './supply-chain.service';

@Controller('shipments')
export class SupplyChainController {
    constructor(private readonly supplyChainService: SupplyChainService) {}

    @Post()
    create(@Body() createShipmentDto: any) {
        return this.supplyChainService.create(createShipmentDto);
    }

    @Get()
    findAll() {
        return this.supplyChainService.findAll();
    }
}
