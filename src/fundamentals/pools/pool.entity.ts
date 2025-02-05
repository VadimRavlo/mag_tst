import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../providers/database/base-service/base.entity';
import { Tick } from '../ticks/tick.entity';
import { DatabaseTablesEnum } from '../../providers/database/base-service/enums';

@Entity({ name: DatabaseTablesEnum.POOLS })
export class Pool extends BaseEntity {
  @Column()
  token0Address: string;

  @Column()
  token0Symbol: string;

  @Column()
  token0Decimals: number;

  @Column()
  token1Address: string;

  @Column()
  token1Symbol: string;

  @Column()
  token1Decimals: number;

  @Column()
  feeTier: number;

  @Column()
  liquidity: string;

  @Column()
  sqrtPrice: string;

  @Column()
  tick: number;

  @Column('decimal')
  volumeUSD: string;

  @Column()
  txCount: number;

  @OneToMany(() => Tick, (tick) => tick.pool)
  ticks: Tick[];
}
