import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

export default abstract class DaoService<T> {
  protected logger = new Logger(DaoService.name);

  protected constructor(protected readonly repository: Repository<T>) {}

  // the name of the entity to manage by the repository
  protected abstract entityName(): string;

  async save(entityData) {
    this.logger.debug(
      `storing the ${this.entityName()} entity with data: ${JSON.stringify(entityData)}`);
    return this.repository.save(entityData);
  }

  async find(options = {}) {
    this.logger.debug(`selecting the ${this.entityName()} with options: ${JSON.stringify(options)}`);
    return this.repository.find(options);
  }

  async findOne(options) {
    this.logger.debug(
      `selecting the ${this.entityName()} entity with options: ${JSON.stringify(options)}`);
    return this.repository.findOne(options);
  }

  async update(uuid: string, entityData) {
    this.logger.debug(`updating the ${this.entityName()} entity with uuid=${uuid} with data: ${JSON.stringify(entityData)}`);
    return this.repository.update(uuid, entityData);
  }

  async delete(uuid: string) {
    this.logger.debug(`deleting the ${this.entityName()} entity with uuid=${uuid}`); 
    return this.repository.delete(uuid);
  }
}
