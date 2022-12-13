import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { CountryEntity } from '../../../src/country/entities/country.entity';
import { ICountry } from '../../../src/country/interfaces/country.interface';

define(CountryEntity, (faker: typeof Faker) => {

  const entity = new CountryEntity();

  const data: Omit<ICountry, 'id' > = {
    name: null,
  };

  return Object.assign(entity, data);
});
