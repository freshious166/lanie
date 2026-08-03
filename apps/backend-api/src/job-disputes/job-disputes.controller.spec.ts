import { Test, TestingModule } from '@nestjs/testing';
import { JobDisputesController } from './job-disputes.controller';

describe('JobDisputesController', () => {
  let controller: JobDisputesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobDisputesController],
    }).compile();

    controller = module.get<JobDisputesController>(JobDisputesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
