import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentReport, IncidentStatus } from './entities/incident-report.entity';
import { JourneyPlan, JourneyStatus } from './entities/journey-plan.entity';
import { AuditTemplate } from './entities/audit-template.entity';

@Injectable()
export class HseService {
    constructor(
        @InjectRepository(IncidentReport)
        private incidentRepository: Repository<IncidentReport>,
        @InjectRepository(JourneyPlan)
        private journeyRepository: Repository<JourneyPlan>,
        @InjectRepository(AuditTemplate)
        private auditTemplateRepository: Repository<AuditTemplate>
    ) {}

    // Incidents
    async createIncident(tenantId: string, title: string, description: string) {
        const incident = this.incidentRepository.create({
            tenant: { id: tenantId } as any,
            title,
            description,
            status: IncidentStatus.OPEN
        });
        return this.incidentRepository.save(incident);
    }

    async updateIncidentRootCause(incidentId: string, rootCause: string, correctiveAction: string) {
        const incident = await this.incidentRepository.findOne({ where: { id: incidentId } });
        if (!incident) throw new NotFoundException('Incident not found');

        incident.rootCauseCategory = rootCause;
        incident.correctiveAction = correctiveAction;
        incident.status = IncidentStatus.RESOLVED;

        return this.incidentRepository.save(incident);
    }

    // Journeys
    async requestJourney(vehicleId: string, driverId: string, origin: string, dest: string, riskFactors: any) {
        const journey = this.journeyRepository.create({
            vehicle: { id: vehicleId } as any,
            driver: { id: driverId } as any,
            routeOrigin: origin,
            routeDestination: dest,
            riskFactors,
            status: JourneyStatus.PENDING_APPROVAL
        });
        return this.journeyRepository.save(journey);
    }

    async approveJourney(journeyId: string, approverId: string) {
        const journey = await this.journeyRepository.findOne({ where: { id: journeyId } });
        if (!journey) throw new NotFoundException('Journey not found');

        journey.status = JourneyStatus.APPROVED;
        journey.approvedBy = { id: approverId } as any;

        return this.journeyRepository.save(journey);
    }

    // Audits
    async getAuditTemplates() {
        return this.auditTemplateRepository.find({ where: { isActive: true } });
    }
}
