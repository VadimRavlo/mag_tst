import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Pool } from '../../fundamentals/pools/pool.entity';
import { Tick } from '../../fundamentals/ticks/tick.entity';
import { PoolsService } from '../../fundamentals/pools/pools.service';
import { TicksService } from '../../fundamentals/ticks/ticks.service';
import { TheGraphService } from '../../providers/thegraph/thegraph.service';

@Injectable()
export class UniswapSyncManagerService implements OnModuleInit {
  private readonly logger = new Logger(UniswapSyncManagerService.name);

  public async onModuleInit(): Promise<void> {
    // await this.synchronizeAllPoolsAndTicks();
  }

  constructor(
    private readonly theGraphService: TheGraphService,
    private readonly poolsService: PoolsService,
    private readonly ticksService: TicksService,
  ) {}

  async synchronizeAllPoolsAndTicks(blockNumber?: number): Promise<void> {
    const onchainPools =
      await this.theGraphService.fetchUniswapPools(blockNumber);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const pools = onchainPools.map(this.mapPoolData);

    // TODO: chunks
    for (const pool of onchainPools) {
      await this.synchronizePoolData(pools);
      await this.synchronizeTickData(pool.id, blockNumber);
    }
  }

  async synchronizePoolData(pools: Pool[]): Promise<void> {
    await this.poolsService.saveMany(pools);
    this.logger.log(`Synchronized ${pools.length} pools.`);
  }

  async synchronizeTickData(
    poolId: string,
    blockNumber?: number,
  ): Promise<void> {
    const ticks = await this.theGraphService.fetchUniswapTicks(
      poolId,
      blockNumber,
    );
    // Associate ticks with the pool
    const pool = await this.poolsService.findOne({ id: poolId });
    if (!pool) {
      this.logger.error(`Pool with ID ${poolId} not found! Cannot save ticks.`);
      return;
    }

    ticks.forEach((tick) => (tick.pool = pool));
    await this.ticksService.saveMany(ticks);
    this.logger.log(`Synchronized ${ticks.length} ticks for pool ${poolId}.`);
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

    return pool;
  }

  private mapTickData(tickData: any): Tick {
    const tick = new Tick();

    tick.id = tickData.id;
    tick.createdAtOnchain = new Date(tickData.createdAtTimestamp * 1000);
    tick.createdAtBlockNumber = tickData.createdAtBlockNumber;
    tick.tickIdx = tickData.tickIdx;
    tick.poolAddress = tickData.poolAddress;
    tick.liquidityGross = tickData.liquidityGross;
    tick.liquidityNet = tickData.liquidityNet;
    tick.price0 = tickData.price0;
    tick.price1 = tickData.price1;

    return tick;
  }
}
