import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../providers/database/base-service/base.service';
import { HandlingState } from './handling-state.entity';

@Injectable()
export class HandlingStateService extends BaseService<HandlingState> {
  constructor(
    @InjectRepository(HandlingState)
    public override repository: Repository<HandlingState>,
  ) {
    super(HandlingState, repository);
  }
}
