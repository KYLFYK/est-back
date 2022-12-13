import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { PressEntity } from 'src/press/entities/press.entity';
import { IPress } from 'src/press/interfaces/press.interface';

define(PressEntity, (faker: typeof Faker) => {

  const entity = new PressEntity();

  const data: Omit<IPress, 'id' > = {
    date: faker.date.past(),
    link: faker.internet.url(),
    title: null,
    text: null,
    logo: faker.image.imageUrl()
  };

  return Object.assign(entity, data);
});
