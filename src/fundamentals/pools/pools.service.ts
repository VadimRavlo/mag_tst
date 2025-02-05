import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../providers/database/base-service/base.service';
import { Pool } from './pool.entity';

@Injectable()
export class PoolsService extends BaseService<Pool> {
  constructor(
    @InjectRepository(Pool)
    public override repository: Repository<Pool>,
  ) {
    super(Pool, repository);
  }
}
