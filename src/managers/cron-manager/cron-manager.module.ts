import { Module } from '@nestjs/common';

import { CronManagerService } from './cron-manager.service';
import { UniswapSyncManagerModule } from '../uniswap-sync-manager/uniswap-sync-manager.module';

@Module({
  imports: [UniswapSyncManagerModule],
  providers: [CronManagerService],
  exports: [CronManagerService],
})
export class CronManagerModule {}
