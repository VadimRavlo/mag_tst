import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tick } from './tick.entity';
import { TicksService } from './ticks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tick])],
  providers: [TicksService],
  exports: [TicksService],
})
export class TicksModule {}
