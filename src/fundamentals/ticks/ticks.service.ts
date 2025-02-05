import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../providers/database/base-service/base.service';
import { Tick } from './tick.entity';

@Injectable()
export class TicksService extends BaseService<Tick> {
  constructor(
    @InjectRepository(Tick)
    public override repository: Repository<Tick>,
  ) {
    super(Tick, repository);
  }
}
