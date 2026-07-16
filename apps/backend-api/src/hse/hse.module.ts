import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HseService } from './hse.service';
import { IncidentReport } from './entities/incident-report.entity';
import { JourneyPlan } from './entities/journey-plan.entity';
import { RiskAssessment } from './entities/risk-assessment.entity';
import { ComplianceDocument } from './entities/compliance-document.entity';
import { AuditTemplate } from './entities/audit-template.entity';
import { RegulatoryBody } from './entities/regulatory-body.entity';
import { HseController } from './hse.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IncidentReport,
            JourneyPlan,
            RiskAssessment,
            ComplianceDocument,
            AuditTemplate,
            RegulatoryBody
        ])
    ],
    controllers: [HseController],
    providers: [HseService],
    exports: [HseService]
})
export class HseModule {}
