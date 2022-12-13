import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { ICustomer } from 'src/account-property/interfaces/customer/customer.interface';
import { CustomerEntity } from 'src/account-property/entities/customer.entity';

define(CustomerEntity, (faker: typeof Faker) => {
  const entity = new CustomerEntity();

  const data: Omit<ICustomer, 'id'> = {
    name: faker.name.firstName(),
    phone: faker.phone.phoneNumberFormat(),
  };

  return Object.assign(entity, data);
});
