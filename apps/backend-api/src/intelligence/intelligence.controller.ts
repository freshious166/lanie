import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { DriverRiskService } from './driver-risk.service';
import { FuelAnomalyService } from './fuel-anomaly.service';

@Controller('intelligence')
export class IntelligenceController {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehiclesRepository: Repository<Vehicle>,
        private readonly driverRiskService: DriverRiskService,
        private readonly fuelAnomalyService: FuelAnomalyService
    ) {}

    @Get('dashboard')
    async getDashboardMetrics() {
        const allVehicles = await this.vehiclesRepository.find();
        const totalVehicles = allVehicles.length;
        
        // Count vehicles that are not Healthy
        const highRiskVehicles = allVehicles.filter(v => v.status === 'Warning' || v.status === 'Critical').length;
        
        // Calculate realistic metrics based on active fleet size
        const estFuelCost = totalVehicles > 0 ? totalVehicles * 150 * 1050 : 0; // 150L * 1050 NGN/liter
        const estEmissions = totalVehicles > 0 ? (totalVehicles * 2.4).toFixed(1) : '0'; // 2.4 tons per vehicle
        const utilPercent = totalVehicles > 0 ? Math.round(((totalVehicles - highRiskVehicles) / totalVehicles) * 100) : 0;

        return {
            fuelCost: `₦${estFuelCost.toLocaleString()}/mo`,
            highRiskVehicles,
            carbonEmissions: `${estEmissions} Tons CO2e`,
            utilization: `${utilPercent}%`,
            fuelTrend: 'up_2',
            emissionsTrend: 'down_5'
        };
    }
}
