import { Test, TestingModule } from '@nestjs/testing';
import { JobDisputesService } from './job-disputes.service';

describe('JobDisputesService', () => {
  let service: JobDisputesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobDisputesService],
    }).compile();

    service = module.get<JobDisputesService>(JobDisputesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
