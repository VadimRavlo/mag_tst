import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Pool } from '../../fundamentals/pools/pool.entity';
import { Tick } from '../../fundamentals/ticks/tick.entity';
import { PoolsService } from '../../fundamentals/pools/pools.service';
import { TicksService } from '../../fundamentals/ticks/ticks.service';
import { TheGraphService } from '../../providers/thegraph/thegraph.service';
import { HandlingStateService } from '../../fundamentals/handling-state/handling-state.service';
import { pick } from 'lodash';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class UniswapSyncManagerService {
  private readonly logger = new Logger(UniswapSyncManagerService.name);

  constructor(
    private readonly theGraphService: TheGraphService,
    private readonly poolsService: PoolsService,
    private readonly ticksService: TicksService,
    private readonly handlingStateService: HandlingStateService,
  ) {}

  async synchronizeAllPoolsAndTicks(): Promise<void> {
    const handlingState = await this.handlingStateService.findOne({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lastBlock: Not(IsNull()),
    });
    if (!handlingState) throw new NotFoundException('Handling state not found');
    const blockNumber = handlingState.lastBlock;

    const pools = await this.synchronizePoolData();
    let updatedLastBlock = blockNumber;
    for (const pool of pools) {
      updatedLastBlock = await this.synchronizeTickData(pool.id, blockNumber);
    }

    // update last block only in case full ticks' data handled to not skip any new tick
    await this.handlingStateService.save({
      id: handlingState.id,
      lastBlock: updatedLastBlock,
    });
  }

  async synchronizePoolData(): Promise<Pool[]> {
    const onchainPools =
      await this.theGraphService.fetchUniswapV3SequentialPools();
    const pools = onchainPools.map((onchainPool) =>
      this.mapPoolData(onchainPool),
    );

    // will be inserted in case absent pool and updated in case it's existing pool
    // updating will be without cascade saving ticks relations
    // since we didn't specify cascade option inside these entities
    await this.poolsService.saveMany(pools);
    this.logger.log(`Synchronized ${pools.length} pools.`);

    return pools;
  }

  async synchronizeTickData(poolId: string, blockNumber = 0): Promise<number> {
    let updatedBlockNumber = blockNumber;

    const onchainTicks = await this.theGraphService.fetchUniswapV3Ticks(
      poolId,
      blockNumber,
    );

    const pool = await this.poolsService.findOne({ id: poolId });
    if (!pool) {
      this.logger.error(`Pool with ID ${poolId} not found! Cannot save ticks.`);
      return blockNumber;
    }

    const ticks = onchainTicks.map((onchainTick) =>
      this.mapTickData(onchainTick),
    );
    ticks.forEach((tick) => {
      tick.pool = pool;

      updatedBlockNumber =
        +tick.createdAtBlockNumber > updatedBlockNumber
          ? +tick.createdAtBlockNumber
          : updatedBlockNumber;
    });

    // only new ticks can be added since tick's data cannot be changed onchain
    // new ticks starting from the "lastBlock handled" will be added
    await this.ticksService.saveMany(ticks);
    this.logger.log(`Synchronized ${ticks.length} ticks for pool ${poolId}.`);

    return updatedBlockNumber;
  }

  private mapPoolData(poolData: any): Pool {
    const pool = new Pool();

    pool.id = poolData.id;
    pool.createdAtOnchain = new Date(poolData.createdAtTimestamp * 1000);
    pool.createdAtBlockNumber = poolData.createdAtBlockNumber;
    pool.token0Address = poolData.token0.id;
    pool.token0Symbol = poolData.token0.symbol;
    pool.token0Decimals = poolData.token0.decimals;
    pool.token1Address = poolData.token1.id;
    pool.token1Symbol = poolData.token1.symbol;
    pool.token1Decimals = poolData.token1.decimals;
    pool.feeTier = poolData.feeTier;
    pool.liquidity = poolData.liquidity;
    pool.sqrtPrice = poolData.sqrtPrice;
    pool.tick = poolData.tick;
    pool.volumeUSD = poolData.volumeUSD;
    pool.txCount = poolData.txCount;

    // adjusted human-readable price calculation logic
    pool.adjustedPrice = (
      (+pool.sqrtPrice / 2 ** 96) ** 2 *
      (10 ** pool.token0Decimals / 10 ** pool.token1Decimals)
    ).toString();

    return pool;
  }

  private mapTickData(tickData: any): Tick {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const tick: Tick = pick(tickData, [
      'id',
      'createdAtBlockNumber',
      'tickIdx',
      'poolAddress',
      'liquidityGross',
      'liquidityNet',
      'price0',
      'price1',
    ]);
    tick.createdAtOnchain = new Date(tickData.createdAtTimestamp * 1000);

    return tick;
  }
}
