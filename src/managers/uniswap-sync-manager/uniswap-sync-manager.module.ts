import { Module } from '@nestjs/common';
import { UniswapSyncManagerService } from './uniswap-sync-manager.service';

import { TicksModule } from '../../fundamentals/ticks/ticks.module';
import { PoolsModule } from '../../fundamentals/pools/pools.module';
import { TheGraphModule } from '../../providers/thegraph/thegraph.module';

@Module({
  imports: [PoolsModule, TicksModule, TheGraphModule],
  providers: [UniswapSyncManagerService],
  exports: [UniswapSyncManagerService],
})
export class UniswapSyncManagerModule {}
