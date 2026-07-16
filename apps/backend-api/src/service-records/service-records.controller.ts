import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServiceRecordsService } from './service-records.service';

@Controller('service-records')
export class ServiceRecordsController {
    constructor(private readonly serviceRecordsService: ServiceRecordsService) {}

    @Post()
    create(@Body() createDto: any) {
        return this.serviceRecordsService.create(createDto);
    }

    @Get()
    findAll() {
        return this.serviceRecordsService.findAll();
    }

    @Get('vehicle/:vehicleId')
    findByVehicle(@Param('vehicleId') vehicleId: string) {
        return this.serviceRecordsService.findByVehicle(vehicleId);
    }
}
