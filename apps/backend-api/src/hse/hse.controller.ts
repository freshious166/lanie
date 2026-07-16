import { Controller, Get } from '@nestjs/common';
import { HseService } from './hse.service';

@Controller('hse')
export class HseController {
    constructor(private readonly hseService: HseService) {}

    @Get('compliance')
    async getComplianceData() {
        return {
            audits: [
                {
                    id: '1',
                    title: 'Q3 NUPRC Fleet Assessment',
                    completedBy: 'Safety Inspector',
                    status: 'Passed'
                }
            ],
            incidents: [
                {
                    id: '1',
                    title: 'Vehicle KJA-453-XY Engine Failure',
                    rootCause: 'Mechanical Failure (Oil Pump)',
                    status: 'Open RCA'
                }
            ],
            journeys: [],
            docs: [
                {
                    id: '1',
                    title: 'FRSC Roadworthiness (Lagos Fleet)',
                    expiresIn: 'Expires in 14 days',
                    status: 'Expiring'
                }
            ]
        };
    }
}
