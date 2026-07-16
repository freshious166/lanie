import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telemetry } from '../tracking/entities/telemetry.entity';
import { RiskAssessment } from '../hse/entities/risk-assessment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DriverRiskService {
    private readonly logger = new Logger(DriverRiskService.name);

    constructor(
        @InjectRepository(Telemetry)
        private telemetryRepository: Repository<Telemetry>,
        @InjectRepository(RiskAssessment)
        private riskAssessmentRepository: Repository<RiskAssessment>
    ) {}

    async calculateDriverScore(driverId: string, tenantId: string): Promise<number> {
        // Real database-driven scoring
        // In a real app we would join vehicles assigned to this driver, but for now we'll just get all telemetry
        const recentTelemetry = await this.telemetryRepository.find({
            order: { timestamp: 'DESC' },
            take: 100
        });

        let score = 100;
        let harshBrakingEvents = 0;
        let speedingEvents = 0;

        for (const t of recentTelemetry) {
            if (t.eventType === 'HARSH_BRAKING') {
                harshBrakingEvents++;
                score -= 5;
            } else if (t.speedKmh && t.speedKmh > 100) {
                speedingEvents++;
                score -= 2;
            }
        }

        score = Math.max(score, 0);

        const assessment = this.riskAssessmentRepository.create({
            driver: { id: driverId } as User,
            tenant: { id: tenantId } as any,
            score,
            factors: { harshBraking: harshBrakingEvents, speeding: speedingEvents }
        });

        await this.riskAssessmentRepository.save(assessment);
        this.logger.log(`Calculated risk score ${score} for driver ${driverId}`);
        
        return score;
    }
}
