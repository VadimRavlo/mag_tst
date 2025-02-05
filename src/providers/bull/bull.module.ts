import { BullModule as Bull } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { BaseConsumerService } from './base-consumer.service';
import { QueueProcessorsEnum } from './enums';
import { ConfigurationService } from '../../configurations/configuration.service';

const configurationService = new ConfigurationService();

@Module({
  imports: [
    Bull.forRoot({
      redis: configurationService.getRedisConfigurations(),
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    Bull.registerQueue({
      name: QueueProcessorsEnum.DATA_SYNC,
    }),
  ],
  providers: [BaseConsumerService],
  exports: [BaseConsumerService, Bull],
})
export class BullModule {}
