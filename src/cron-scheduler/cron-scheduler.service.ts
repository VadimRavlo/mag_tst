import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bull';

import { CronExpressionsEnum } from './enums';
import {
  QueueProcessesEnum,
  QueueProcessorsEnum,
} from '../providers/bull/enums';

@Injectable()
export class CronSchedulerService implements OnModuleInit {
  constructor(
    @InjectQueue(QueueProcessorsEnum.DATA_SYNC) private dataSeedingQueue: Queue,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.startTimeSlotsSeeding();
  }

  private async startTimeSlotsSeeding(): Promise<void> {
    await this.clearExistingQueues(this.dataSeedingQueue);
    await this.addJobToBullQueue(
      this.dataSeedingQueue,
      QueueProcessesEnum.POOLS_TICKS_SYNC,
      CronExpressionsEnum.EVERY_HOUR_AT_30_MINUTE,
    );
  }

  private async clearExistingQueues(queue: Queue): Promise<void> {
    await queue.clean(0);
  }

  private async addJobToBullQueue(
    queue: Queue,
    jobName: QueueProcessesEnum,
    frequency: CronExpressionsEnum,
  ): Promise<void> {
    await queue.add(
      jobName,
      {},
      {
        attempts: 1,
        repeat: { cron: frequency },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
