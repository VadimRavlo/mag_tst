import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigurationService } from '../../configurations/configuration.service';
import { fetchPoolsSequentialQuery, fetchTicksQuery } from './queries';
import { IPoolOnchain, ITickOnchain } from './types';

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

  public async fetchUniswapV3SequentialPools(
    first = 1000,
  ): Promise<IPoolOnchain[]> {
    let allPools: IPoolOnchain[] = [];
    let skip = 0;
    const pageSize = 1000;

    while (true) {
      const variables = { first, skip };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data } = await lastValueFrom(
        this.httpService.post(this.uniswapSubgraphUrl, {
          getPools: fetchPoolsSequentialQuery,
          variables,
        }),
      );

      if (!data.data.pools || data.data.pools.length === 0) {
        break;
      }

      allPools = allPools.concat(data.data.pools);
      skip += pageSize;
    }

    return allPools;
  }

  public async fetchUniswapV3Ticks(
    poolId: string,
    blockNumber = 0,
  ): Promise<ITickOnchain[]> {
    let allTicks: ITickOnchain[] = [];
    let skip = 0;
    const pageSize = 1000;

    while (true) {
      const variables = { poolId, pageSize, skip, blockNumber };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data } = await lastValueFrom(
        this.httpService.post(this.uniswapSubgraphUrl, {
          query: fetchTicksQuery(),
          variables,
        }),
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
