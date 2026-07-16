import { Controller, Get } from '@nestjs/common';
import { DriverRiskService } from './driver-risk.service';
import { FuelAnomalyService } from './fuel-anomaly.service';

@Controller('intelligence')
export class IntelligenceController {
    constructor(
        private readonly driverRiskService: DriverRiskService,
        private readonly fuelAnomalyService: FuelAnomalyService
    ) {}

    @Get('dashboard')
    async getDashboardMetrics() {
        // Mocked aggregation for BI Dashboard
        return {
            fuelCost: '₦450/km',
            highRiskVehicles: 3,
            carbonEmissions: '12.4 Tons CO2e',
            utilization: '84%',
            fuelTrend: 'up_2',
            emissionsTrend: 'down_5'
        };
    }
}
