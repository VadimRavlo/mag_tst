import { Module } from '@nestjs/common';
import { UniswapSyncManagerModule } from './uniswap-sync-manager/uniswap-sync-manager.module';
import { CronManagerModule } from './cron-manager/cron-manager.module';

const modules = [UniswapSyncManagerModule, CronManagerModule];
@Module({
  imports: modules,
  exports: modules,
})
export class ManagersModule {}
