import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { IAccount } from '../../../src/account/interfaces/account.interface';
import { AccountEntity } from '../../../src/account/entities/account.entity';
import { TRole } from '../../../src/account/types/role';

define(AccountEntity, (faker: typeof Faker) => {
  const entity = new AccountEntity();

  const data: Omit<IAccount, 'id' | 'updateAt' | 'createAt' > = {
    email: faker.internet.exampleEmail(),
    role: faker.random.objectElement(TRole),
    markAsDelete: faker.random.boolean(),
    phone: faker.phone.phoneNumberFormat(),
    isConfirmed: faker.random.boolean(),
    customerProperty: null,
    developerProperty: null,
    agencyProperty: null,
    agentProperty: null,
    adminProperty: null,
    bankProperty: null,
  };

  return Object.assign(entity, data);
});
