import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentReport, IncidentStatus } from './entities/incident-report.entity';
import { JourneyPlan, JourneyStatus } from './entities/journey-plan.entity';
import { AuditTemplate } from './entities/audit-template.entity';
import { ComplianceDocument } from './entities/compliance-document.entity';

@Injectable()
export class HseService {
    constructor(
        @InjectRepository(IncidentReport)
        private incidentRepository: Repository<IncidentReport>,
        @InjectRepository(JourneyPlan)
        private journeyRepository: Repository<JourneyPlan>,
        @InjectRepository(AuditTemplate)
        private auditTemplateRepository: Repository<AuditTemplate>,
        @InjectRepository(ComplianceDocument)
        private docsRepository: Repository<ComplianceDocument>
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

    async getComplianceOverview() {
        const audits = await this.auditTemplateRepository.find({ take: 5, order: { createdAt: 'DESC' } });
        const incidents = await this.incidentRepository.find({ take: 5, order: { createdAt: 'DESC' } });
        const journeys = await this.journeyRepository.find({ take: 5, order: { createdAt: 'DESC' } });
        const docs = await this.docsRepository.find({ take: 5, order: { expiresAt: 'ASC' } });

        return {
            audits: audits.map(a => ({
                id: a.id,
                title: a.name,
                completedBy: 'Safety Inspector',
                status: 'Passed'
            })),
            incidents: incidents.map(i => ({
                id: i.id,
                title: i.title,
                rootCause: i.rootCauseCategory || 'Pending Investigation',
                status: i.status
            })),
            journeys: journeys.map(j => ({
                id: j.id,
                title: `${j.routeOrigin} to ${j.routeDestination}`,
                status: j.status
            })),
            docs: docs.map(d => ({
                id: d.id,
                title: d.documentName,
                expiresIn: `Expires ${d.expiresAt.toISOString().split('T')[0]}`,
                status: 'Expiring'
            }))
        };
    }

    async seedDemoData() {
        // Seed incidents
        if (await this.incidentRepository.count() === 0) {
            await this.incidentRepository.save([
                this.incidentRepository.create({
                    title: 'Vehicle LNF-453-XY Engine Failure',
                    description: 'Engine stalled on highway.',
                    rootCauseCategory: 'Mechanical Failure (Oil Pump)',
                    status: IncidentStatus.OPEN
                }),
                this.incidentRepository.create({
                    title: 'Driver Fatigue Incident',
                    description: 'Driver reported extreme fatigue near Abuja.',
                    rootCauseCategory: 'Scheduling Error',
                    status: IncidentStatus.INVESTIGATING
                })
            ]);
        }

        // Seed audits
        if (await this.auditTemplateRepository.count() === 0) {
            await this.auditTemplateRepository.save([
                this.auditTemplateRepository.create({
                    name: 'Q3 NUPRC Fleet Assessment',
                    description: 'Quarterly compliance check.',
                    schema: {}
                })
            ]);
        }

        // Seed docs
        if (await this.docsRepository.count() === 0) {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            await this.docsRepository.save([
                this.docsRepository.create({
                    documentName: 'FRSC Roadworthiness (Lagos Fleet)',
                    documentUrl: 'http://example.com/doc',
                    issuedAt: new Date(),
                    expiresAt: nextWeek
                })
            ]);
        }

        return { success: true, message: 'HSE data seeded' };
    }
}
