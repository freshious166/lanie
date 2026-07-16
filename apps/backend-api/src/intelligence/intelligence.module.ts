import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictiveMaintenanceService } from './predictive-maintenance.service';
import { FuelAnomalyService } from './fuel-anomaly.service';
import { DriverRiskService } from './driver-risk.service';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { ServiceRecord } from '../service-records/entities/service-record.entity';
import { Telemetry } from '../tracking/entities/telemetry.entity';
import { RiskAssessment } from '../hse/entities/risk-assessment.entity';
import { IntelligenceController } from './intelligence.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vehicle, ServiceRecord, Telemetry, RiskAssessment])
    ],
    controllers: [IntelligenceController],
    providers: [PredictiveMaintenanceService, FuelAnomalyService, DriverRiskService],
    exports: [PredictiveMaintenanceService, FuelAnomalyService, DriverRiskService]
})
export class IntelligenceModule {}
