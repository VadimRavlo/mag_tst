import { Module } from '@nestjs/common';
import { UniswapSyncManagerModule } from './uniswap-sync-manager/uniswap-sync-manager.module';

const modules = [UniswapSyncManagerModule];
@Module({
  imports: modules,
  exports: modules,
})
export class ManagersModule {}
