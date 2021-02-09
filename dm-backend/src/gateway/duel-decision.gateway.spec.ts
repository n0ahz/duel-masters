import { Test, TestingModule } from '@nestjs/testing';
import { DuelDecisionGateway } from './duel-decision.gateway';

describe('DuelDecisionGateway', () => {
  let gateway: DuelDecisionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DuelDecisionGateway],
    }).compile();

    gateway = module.get<DuelDecisionGateway>(DuelDecisionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
