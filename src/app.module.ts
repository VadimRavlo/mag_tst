import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './providers/database/database-config';
import { ConfigurationModule } from './configurations/configuration.module';
import { ManagersModule } from './managers/managers.module';
import { PoolsModule } from './fundamentals/pools/pools.module';
import { TicksModule } from './fundamentals/ticks/ticks.module';
import { TheGraphModule } from './providers/thegraph/thegraph.module';
import { BullModule } from './providers/bull/bull.module';
import { CronSchedulerModule } from './cron-scheduler/cron-scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseOptions),
    ConfigurationModule,
    PoolsModule,
    TicksModule,
    TheGraphModule,
    BullModule,
    CronSchedulerModule,
    ManagersModule,
  ],
  controllers: [],
})
export class AppModule {}
