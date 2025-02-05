import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './providers/database/database-config';
import { ConfigurationModule } from './configurations/configuration.module';
import { ManagersModule } from './managers/managers.module';
import { PoolsModule } from './fundamentals/pools/pools.module';
import { TicksModule } from './fundamentals/ticks/ticks.module';
import { TheGraphModule } from './providers/thegraph/thegraph.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseOptions),
    ConfigurationModule,
    PoolsModule,
    TicksModule,
    TheGraphModule,
    ManagersModule,
  ],
  controllers: [],
})
export class AppModule {}
