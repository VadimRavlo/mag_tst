import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DatabaseTablesEnum } from '../../providers/database/base-service/enums';

@Entity({ name: DatabaseTablesEnum.HANDLING_STATE })
export class HandlingState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column()
  lastBlock: number;
}
