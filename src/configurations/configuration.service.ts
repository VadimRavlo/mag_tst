import { ConfigurationDto } from './dtos/configuration.dto';
import { Injectable, Logger } from '@nestjs/common';
import { validateSync, ValidationError } from 'class-validator';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { IDatabaseOptions } from './types/database-options.interface';
import { RedisOptions } from 'ioredis';

@Injectable()
export class ConfigurationService {
  private readonly configuration: ConfigurationDto;

  constructor() {
    const configuration = new ConfigurationDto();

    Object.assign(configuration, {
      ...ConfigurationService.getDotenvConfiguration(),
      ...process.env,
    });

    const validationResult: ValidationError[] = validateSync(configuration, {
      whitelist: true,
    });

    if (validationResult && validationResult.length > 0) {
      Logger.error(
        'Configuration invalid',
        `Validation errors:\n${this.extractValidationErrorMessages(validationResult)}`,
      );
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Configuration invalid\n${validationResult}`);
    }

    this.configuration = configuration;
  }

  private static getDotenvConfiguration(): Record<string, string | null> {
    const ENV_PATH = path.resolve(process.cwd(), '.env');
    return fs.existsSync(ENV_PATH)
      ? dotenv.parse(fs.readFileSync(ENV_PATH))
      : {};
  }

  private extractValidationErrorMessages(
    validationErrors: ValidationError[],
  ): string {
    return validationErrors
      .map(
        (validationError) =>
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          ` ${Object.values(validationError.constraints || {})},`,
      )
      .join('\n');
  }

  public get<K extends keyof ConfigurationDto>(key: K): ConfigurationDto[K] {
    if (this.configuration[key] && !(this.configuration[key] === 'null')) {
      return this.configuration[key];
    }
    throw new Error(`Environment variable ${key} is null`);
  }

  public getDBConfiguration(): IDatabaseOptions {
    return {
      host: this.get('DB_HOST'),
      port: +this.get('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
      logging: !!this.get('DB_LOGGING'),
    };
  }

  public getRedisConfigurations(): RedisOptions {
    return {
      host: this.get('REDIS_HOST'),
      port: +this.get('REDIS_PORT'),
      username: this.get('REDIS_USER'),
      password: this.get('REDIS_PASSWORD'),
    };
  }
}
