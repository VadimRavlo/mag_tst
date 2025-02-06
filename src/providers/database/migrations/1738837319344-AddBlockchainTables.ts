import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlockchainTables1738837319344 implements MigrationInterface {
  name = 'AddBlockchainTables1738837319344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ticks"
       (
           "id"                   uuid                     NOT NULL DEFAULT uuid_generate_v4(),
           "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
           "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
           "createdAtOnchain"     TIMESTAMP WITH TIME ZONE NOT NULL,
           "createdAtBlockNumber" character varying        NOT NULL,
           "tickIdx"              integer                  NOT NULL,
           "poolAddress"          character varying        NOT NULL,
           "liquidityGross"       numeric(50, 0)           NOT NULL DEFAULT '0',
           "liquidityNet"         numeric(50, 0)           NOT NULL DEFAULT '0',
           "price0"               numeric                  NOT NULL,
           "price1"               numeric                  NOT NULL,
           "poolId"               uuid,
           CONSTRAINT "PK_d29dabc03f2d559d30a1f69ae5b" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "pools"
       (
           "id"                   uuid                     NOT NULL DEFAULT uuid_generate_v4(),
           "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
           "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
           "createdAtOnchain"     TIMESTAMP WITH TIME ZONE NOT NULL,
           "createdAtBlockNumber" character varying        NOT NULL,
           "token0Address"        character varying        NOT NULL,
           "token0Symbol"         character varying        NOT NULL,
           "token0Decimals"       integer                  NOT NULL,
           "token1Address"        character varying        NOT NULL,
           "token1Symbol"         character varying        NOT NULL,
           "token1Decimals"       integer                  NOT NULL,
           "feeTier"              integer                  NOT NULL,
           "liquidity"            numeric(50, 0)           NOT NULL DEFAULT '0',
           "sqrtPrice"            numeric(50, 0)           NOT NULL DEFAULT '0',
           "adjustedPrice"        numeric(50, 25)          NOT NULL DEFAULT '0',
           "tick"                 integer                  NOT NULL,
           "volumeUSD"            numeric                  NOT NULL,
           "txCount"              integer                  NOT NULL,
           CONSTRAINT "PK_6708c86fc389259de3ee43230ee" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "handling_state"
       (
           "id"        uuid                     NOT NULL DEFAULT uuid_generate_v4(),
           "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
           "lastBlock" integer                  NOT NULL,
           CONSTRAINT "PK_9196709dc7e2316277e41c534b2" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticks"
          ADD CONSTRAINT "FK_8c2cf1e5a69eab9599ca7fbd25f" FOREIGN KEY ("poolId") REFERENCES "pools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticks" DROP CONSTRAINT "FK_8c2cf1e5a69eab9599ca7fbd25f"`,
    );
    await queryRunner.query(`DROP TABLE "handling_state"`);
    await queryRunner.query(`DROP TABLE "pools"`);
    await queryRunner.query(`DROP TABLE "ticks"`);
  }
}
