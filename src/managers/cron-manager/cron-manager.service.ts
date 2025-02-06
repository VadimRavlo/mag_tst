import { Injectable, Logger } from '@nestjs/common';
import type { Job } from 'bull';

import { UniswapSyncManagerService } from '../uniswap-sync-manager/uniswap-sync-manager.service';

@Injectable()
export class CronManagerService {
  private readonly logger: Logger;

  constructor(
    private readonly uniswapSyncManagerService: UniswapSyncManagerService,
  ) {
    this.logger = new Logger(CronManagerService.name);
  }

  async startUniswapSyncJob(job: Job<unknown>): Promise<void> {
    this.logger.debug('UniswapV3 sync job in the process...', job.data);
    await this.uniswapSyncManagerService.synchronizeAllPoolsAndTicks();
  }
}
