import { Module } from '@nestjs/common';
import { PoolsModule } from './pools/pools.module';
import { TicksModule } from './ticks/ticks.module';

const modules = [TicksModule, PoolsModule];

@Module({
  imports: modules,
  exports: modules,
})
export class FundamentalsModule {}
