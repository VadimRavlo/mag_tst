export const fetchPoolsQuery = `
  query pools($blockNumber: Int) {
    pools(block: { number: $blockNumber }) {
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

export function fetchTicksQuery(pageSize: number): string {
  return `
    query ticks($poolId: String!, $skip: Int, $blockNumber: Int) {
      ticks(
        first: ${pageSize}
        skip: $skip
        where: { pool: $poolId }
        block: { number: $blockNumber }
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
