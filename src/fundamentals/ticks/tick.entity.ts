import { BaseEntity } from '../../providers/database/base-service/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Pool } from '../pools/pool.entity';
import { DatabaseTablesEnum } from '../../providers/database/base-service/enums';

@Entity({ name: DatabaseTablesEnum.TICKS })
export class Tick extends BaseEntity {
  @Column()
  tickIdx: number;

  @Column()
  poolAddress: string;

  @Column({ type: 'numeric', precision: 50, scale: 0, default: '0' })
  liquidityGross: string;

  @Column({ type: 'numeric', precision: 50, scale: 0, default: '0' })
  liquidityNet: string;

  @Column('decimal')
  price0: string;

  @Column('decimal')
  price1: string;

  @ManyToOne(() => Pool, (pool) => pool.ticks)
  pool: Pool;
}
