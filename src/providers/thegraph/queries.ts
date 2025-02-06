export const fetchPoolsSequentialQuery = `
  query pools($first: Int, $skip: Int,) {
    pools(first: $first, skip: $skip) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      feeTier
      liquidity
      sqrtPrice
      tick
      volumeUSD
      txCount
      createdAtTimestamp
      createdAtBlockNumber
    }
  }
`;

export function fetchTicksQuery(): string {
  return `
    query ticks($poolId: String!, $pageSize:Int, $skip: Int, $blockNumber: Int) {
      ticks(
        first: $pageSize
        skip: $skip
        where: { pool: $poolId, createdAtBlockNumber_gt: $blockNumber }
      ) {
        id
        poolAddress
        tickIdx
        liquidityGross
        liquidityNet
        price0
        price1
        createdAtTimestamp
        createdAtBlockNumber
      }
    }
  `;
}
