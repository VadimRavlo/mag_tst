import { IPoolOnchain } from './pool-onchain.interface';

export interface ITickOnchain {
  id: string;
  poolAddress: string;
  tickIdx: string;
  pool: IPoolOnchain;
  liquidityGross: string;
  liquidityNet: string;
  price0: string;
  price1: string;
  createdAtTimestamp: string;
  createdAtBlockNumber: string;
}
