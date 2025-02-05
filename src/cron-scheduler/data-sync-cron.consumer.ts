import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { CronManagerService } from '../managers/cron-manager/cron-manager.service';
import { BaseConsumerService } from '../providers/bull/base-consumer.service';
import {
  QueueProcessesEnum,
  QueueProcessorsEnum,
} from '../providers/bull/enums';

@Processor(QueueProcessorsEnum.DATA_SYNC)
export class DataSyncCronConsumer extends BaseConsumerService {
  constructor(private readonly cronManagerService: CronManagerService) {
    super();
  }

  @Process(QueueProcessesEnum.POOLS_TICKS_SYNC)
  async startTimeSlotsSeedingJob(job: Job<unknown>): Promise<void> {
    await this.cronManagerService.startUniswapSyncJob(job);
  }
}
