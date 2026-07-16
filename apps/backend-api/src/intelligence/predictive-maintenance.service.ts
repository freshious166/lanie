import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { ServiceRecord } from '../service-records/entities/service-record.entity';

@Injectable()
export class PredictiveMaintenanceService {
    private readonly logger = new Logger(PredictiveMaintenanceService.name);

    constructor(
        @InjectRepository(Vehicle)
        private vehicleRepository: Repository<Vehicle>,
        @InjectRepository(ServiceRecord)
        private serviceRecordRepository: Repository<ServiceRecord>
    ) {}

    async calculateRiskScore(vehicleId: string): Promise<number> {
        const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
        if (!vehicle) return 0;

        // Statistical Baseline Implementation
        // In the future, this will be replaced by a learned ML model
        
        let score = 0;
        const currentMileage = vehicle.currentMileage || 0;

        // Rule 1: Mileage since last service
        const lastService = await this.serviceRecordRepository.findOne({
            where: { vehicle: { id: vehicleId } },
            order: { serviceDate: 'DESC' }
        });

        if (lastService) {
            const mileageSinceService = currentMileage - lastService.mileageAtService;
            if (mileageSinceService > 10000) score += 40; // Overdue
            else if (mileageSinceService > 8000) score += 20; // Approaching
        } else {
            // No service history = high risk
            score += 50; 
        }

        // Rule 2: Vehicle age
        const age = new Date().getFullYear() - vehicle.year;
        if (age > 10) score += 20;
        else if (age > 5) score += 10;

        score = Math.min(score, 100);

        vehicle.maintenanceRiskScore = score;
        await this.vehicleRepository.save(vehicle);

        this.logger.log(`Calculated risk score ${score} for vehicle ${vehicle.plateNumber}`);
        return score;
    }
}
