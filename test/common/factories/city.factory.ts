import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { CityEntity } from 'src/city/entities/city.entity';
import { ICity } from 'src/city/interfaces/city.interface';

define(CityEntity, (faker: typeof Faker) => {

  const entity = new CityEntity();

  const data: Omit<ICity, 'id' > = {
    name: null,
  };

  return Object.assign(entity, data);
});
