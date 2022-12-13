import * as Faker from 'faker';
import { ConstructionProgressEntity } from 'src/construction-progress/entities/construction-progress.entity';
import { IConstructionProgress } from 'src/construction-progress/interfaces/construction-progress.interface';
import { define } from 'typeorm-seeding';

define(ConstructionProgressEntity, (faker: typeof Faker) => {

  const entity = new ConstructionProgressEntity();

  const comfortableTimeFrom = faker.date.future();
  const data: Omit<IConstructionProgress, 'id' > = {
    date: faker.date.future(),
    description: faker.lorem.text(),
    file: null
  };

  return Object.assign(entity, data);
});
