import { Module } from '@nestjs/common';
import { TheGraphService } from './thegraph.service';
import { ConfigurationModule } from '../../configurations/configuration.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigurationModule, HttpModule],
  providers: [TheGraphService],
  exports: [TheGraphService],
})
export class TheGraphModule {}
