import { ConfigurationService } from './configuration.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
