import { OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';

export class BaseConsumerService {
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger(BaseConsumerService.name);
  }

  @OnQueueActive()
  onQueueActive(job: Job): void {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job): Promise<void> {
    this.logger.log(`Job ID:${job.id} name:${job.name} has being completed`);

    await job.remove();
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: Error): Promise<void> {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );

    await job.remove();
  }
}
