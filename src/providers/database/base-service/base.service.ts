import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export class BaseService<T extends ObjectLiteral> {
  protected entity: EntityTarget<T>;
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, repository: Repository<T>) {
    this.entity = entity;
    this.repository = repository;
  }

  public async create(
    data: DeepPartial<T>,
    entityManager?: EntityManager,
  ): Promise<T> {
    const repository = this.getRepository(entityManager);
    return repository.save(data);
  }

  public async saveMany<Y extends DeepPartial<T>>(
    data: Y[],
    entityManager?: EntityManager,
  ): Promise<T[]> {
    const repository = this.getRepository(entityManager);
    return repository.save(data);
  }

  public async findOne(
    filters: Partial<T>,
    entityManager?: EntityManager,
  ): Promise<T | null> {
    const repository = this.getRepository(entityManager);
    return repository.findOne({ where: filters });
  }

  public async find(
    filters: FindOptionsWhere<T>,
    entityManager?: EntityManager,
  ): Promise<T[]> {
    const repository = this.getRepository(entityManager);
    return repository.find({ where: filters });
  }

  protected getRepository(entityManager?: EntityManager): Repository<T> {
    return entityManager
      ? entityManager.getRepository(this.entity)
      : this.repository;
  }
}
