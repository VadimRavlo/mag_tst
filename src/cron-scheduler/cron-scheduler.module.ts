import { Module } from '@nestjs/common';

import { CronManagerModule } from '../managers/cron-manager/cron-manager.module';
import { CronSchedulerService } from './cron-scheduler.service';
import { DataSyncCronConsumer } from './data-sync-cron.consumer';
import { BullModule } from '../providers/bull/bull.module';

@Module({
  imports: [BullModule, CronManagerModule],
  providers: [CronSchedulerService, DataSyncCronConsumer],
  exports: [CronSchedulerService, DataSyncCronConsumer],
})
export class CronSchedulerModule {}
