import { Module } from '@nestjs/common';
import { PoolsModule } from './pools/pools.module';
import { TicksModule } from './ticks/ticks.module';
import { HandlingStateModule } from './handling-state/handling-state.module';

const modules = [TicksModule, PoolsModule, HandlingStateModule];

@Module({
  imports: modules,
  exports: modules,
})
export class FundamentalsModule {}
