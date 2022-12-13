import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as faker from 'faker';

/* entities section */
import { ViewApplicationEntity } from '../../../src/view-application/entities/view-application.entity';
import { TObjectType } from '../../../src/object/types/TObjectType';
/* */

export default class ViewApplicationSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {

    const viewApplicationFactory = factory(ViewApplicationEntity)();

    const statuses = await connection
      .createQueryBuilder()
      .select('*')
      .from('guide', 'g')
      .where(`g.type_en = 'viewApplicationStatus'`)
      .getRawMany();

    const objects = await connection
      .createQueryBuilder()
      .select('*')
      .from('set_objects', 'o')
      .getRawMany();


    for (let i = 1; i <= 10; i++) {
      await viewApplicationFactory.create({
        status: faker.random.arrayElement(statuses),
        object: faker.random.arrayElement(objects),
      })
    }
  }
}
