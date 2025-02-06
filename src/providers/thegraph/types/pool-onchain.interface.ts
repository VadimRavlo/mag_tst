import { ITokenOnchain } from './token-onchain.interface';

export interface IPoolOnchain {
  id: string;
  createdAtTimestamp: string;
  createdAtBlockNumber: string;
  feeTier: string;
  liquidity: string;
  sqrtPrice: string;
  tick: string;
  token0: ITokenOnchain;
  token1: ITokenOnchain;
  txCount: string;
  volumeUSD: string;
}
