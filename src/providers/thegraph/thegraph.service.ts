import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Pool } from '../../fundamentals/pools/pool.entity';
import { Tick } from '../../fundamentals/ticks/tick.entity';
import { ConfigurationService } from '../../configurations/configuration.service';
import { fetchPoolsQuery, fetchTicksQuery } from './queries';

@Injectable()
export class TheGraphService {
  private readonly logger = new Logger(TheGraphService.name);
  private readonly uniswapSubgraphUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService,
  ) {
    this.uniswapSubgraphUrl =
      this.configService.get('UNISWAP_SUBGRAPH_URL') ||
      `https://gateway.thegraph.com/api/API_KEY/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;
  }

  public async fetchUniswapPools(blockNumber?: number): Promise<Pool[]> {
    const variables = blockNumber ? { blockNumber } : {};

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { data } = await lastValueFrom(
      this.httpService.post(this.uniswapSubgraphUrl, {
        getPools: fetchPoolsQuery,
        variables,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.data.pools;
  }

  public async fetchUniswapTicks(
    poolId: string,
    blockNumber?: number,
  ): Promise<Tick[]> {
    let allTicks: Tick[] = [];
    let skip = 0;
    const pageSize = 1000;

    while (true) {
      const query = fetchTicksQuery(pageSize);

      const variables = { poolId, skip, blockNumber };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data } = await lastValueFrom(
        this.httpService.post(this.uniswapSubgraphUrl, { query, variables }),
      );

      if (!data.data.ticks || data.data.ticks.length === 0) {
        break;
      }

      allTicks = allTicks.concat(data.data.ticks);
      skip += pageSize;
    }
    return allTicks;
  }
}
