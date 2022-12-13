import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { IAgency } from 'src/account-property/interfaces/agency/agency.interface';
import { AgencyEntity } from 'src/account-property/entities/agency.entity';

define(AgencyEntity, (faker: typeof Faker) => {
  const entity = new AgencyEntity();

  const data: Omit<IAgency, 'id'> = {
    name: faker.company.companyName(),
    status: 'Агенство',
    phone: [{ord: null, value: null}],
    address: faker.address.country() + ', ' + faker.address.city() + ', ' + faker.address.streetAddress(),
    site: faker.internet.url(),
    description: faker.lorem.text(),
  };

  return Object.assign(entity, data);
});
