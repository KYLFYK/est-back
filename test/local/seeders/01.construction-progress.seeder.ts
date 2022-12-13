import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as faker from 'faker';
import { ConstructionProgressEntity } from 'src/construction-progress/entities/construction-progress.entity';

export default class ConstructionProgressSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {

    const constructionProgressFactory = factory(ConstructionProgressEntity)();

    constructionProgressFactory.createMany(20)
  }
}
