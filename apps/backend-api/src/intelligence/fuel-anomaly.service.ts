import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telemetry } from '../tracking/entities/telemetry.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Injectable()
export class FuelAnomalyService {
    private readonly logger = new Logger(FuelAnomalyService.name);

    constructor(
        @InjectRepository(Telemetry)
        private telemetryRepository: Repository<Telemetry>,
        @InjectRepository(Vehicle)
        private vehicleRepository: Repository<Vehicle>
    ) {}

    async analyzeFuelLevels(vehicleId: string, limit: number = 10) {
        const recentTelemetry = await this.telemetryRepository.find({
            where: { vehicle: { id: vehicleId } },
            order: { timestamp: 'DESC' },
            take: limit
        });

        if (recentTelemetry.length < 2) return null;

        const current = recentTelemetry[0];
        const previous = recentTelemetry[1];

        if (current.fuelLevel != null && previous.fuelLevel != null) {
            const drop = previous.fuelLevel - current.fuelLevel;
            const timeDiffHours = (current.timestamp.getTime() - previous.timestamp.getTime()) / (1000 * 60 * 60);

            // Baseline threshold: drop of > 10% in under 1 hour, without significant distance moved
            if (drop > 10 && timeDiffHours < 1) {
                this.logger.warn(`Potential fuel theft detected on vehicle ${vehicleId}. Drop: ${drop}%`);
                return { anomaly: true, severity: 'HIGH', reason: 'SUDDEN_DROP', dropPercentage: drop };
            }
        }

        return { anomaly: false };
    }
}
