import { Module } from '@nestjs/common';
import { UniswapSyncManagerService } from './uniswap-sync-manager.service';

import { TicksModule } from '../../fundamentals/ticks/ticks.module';
import { PoolsModule } from '../../fundamentals/pools/pools.module';
import { TheGraphModule } from '../../providers/thegraph/thegraph.module';
import { HandlingStateModule } from '../../fundamentals/handling-state/handling-state.module';

@Module({
  imports: [PoolsModule, TicksModule, TheGraphModule, HandlingStateModule],
  providers: [UniswapSyncManagerService],
  exports: [UniswapSyncManagerService],
})
export class UniswapSyncManagerModule {}
