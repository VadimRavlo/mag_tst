import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HandlingStateService } from './handling-state.service';
import { HandlingState } from './handling-state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HandlingState])],
  providers: [HandlingStateService],
  exports: [HandlingStateService],
})
export class HandlingStateModule {}
