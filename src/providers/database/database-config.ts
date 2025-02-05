import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigurationService } from '../../configurations/configuration.service';
import { migrations } from './migrations/migrations';
import { entities } from '../../fundamentals/entities';

const configurationService = new ConfigurationService();

export const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  entities,
  migrations,
  migrationsRun: true,
  synchronize: false,
  migrationsTransactionMode: 'each',
  ...configurationService.getDBConfiguration(),
};

export default new DataSource(databaseOptions);
