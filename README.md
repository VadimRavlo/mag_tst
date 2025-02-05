# UniswapV3 Sync Microservice

## Developers support
For developers that support microservice.

### Setup project
From project repository install dependencies:
```bash
$ npm install
```
Create `.env` file with local environment variables and copy data for local development from `.env.example` file

## Launch

### Using of docker-compose for local deployment (recommended)

Launch it from root directory

```bash
$ docker-compose up
```

Using this command will start 4 containers: `postgres` and `api`.

To disable any of these containers and to use an existing one please delete the related section in `docker-compose.yml`

After adding a new module to the project please use:

```bash
$ docker-compose up --build
```

### Using of npm for local deployment (in case you need connect external database or external Redis instance)

To start project, launch it from project repository:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database Access

Local database `uniswap_db` by default is available on `localhost:5432`.

Please use `.env` file for details.

If you previously have started another PostgreSQL container on `localhost:5432` you have to stop the container before running the app.

## File structure

In case creating a new service, module, controller, entity or spec file, please use default file structure:
* all providers, like database, redis, message queues, external APIs should be stored by `src/providers`
* in order to provide additional logs security, you should use logger, stored by `src/logger`
* directory `src/modules` uses default file structure:
  * `src/modules/configurations` only to store configuration service with DTO for `.env` file (in order to check validity of `.env` content)
  * `src/modules/cron-scheduler` only to store cron schedule (without any logic)
  * `src/modules/fundamentals` only to store low-level services with access only to related database's table/entity
  * `src/modules/managers` to store services with complicated logic with access to more than 1 service from fundamentals or providers
  * `src/modules/apis` for all provided by app controllers with related modules/services

## Entities, fundamentals services and DTOs

All entities should be created with extending `/src/providers/database/base-service/base.entity.ts`

The `BaseEntity` have 3 mandatory fields for any new entity:
* `id: uuid`
* `createdAt: timestamp with tz`
* `updatedAt: timestamp with tz`

You don't need to set this fields additionally (please avoid code duplication).

In similar way you should use `BaseService` to extending this classes in your fundamentals services and DTOs:
* `/src/modules/fundamentals/base/base.service.ts` - implemented `create()`, `find()`, `findOne()`, `saveMany()` etc. public methods

For all methods of `BaseService`, in case you need database transactions, you have to use `entityManager: EntityManager` - manager, provided by TypeORM's `DataSource`.
EntityManager is always the last optional parameter of each `BaseService's` extended method.

## Migrate

Nest.js uses TypeORM. It has built in methods to migrate and synchronize DB.

Each Entity for typeORM you need to export in `/src/modules/fundamentals/entities.ts` file in a list of entities because of typeORM v0.3 requirements. Each migration for typeORM you need to export in `/src/providers/database/migrations/migrations.ts` file in a list of migrations because of typeORM v0.3 requirements.

If you're updating entities, you would need to create and run a migration to apply it.

To generate a migration from entities changes:
```bash
$ npm run typeorm:generate
$ Migration name: <migration name in pascal case>
```

To manual run migration:
```bash
$ npm run typeorm:run
```

To revert the last migration:
```bash
$ npm run typeorm:revert
```
