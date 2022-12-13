import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { IAdmin } from '../../../src/account-property/interfaces/admin/admin.interface';
import { AdminEntity } from '../../../src/account-property/entities/admin.entity';

define(AdminEntity, (faker: typeof Faker) => {
  const entity = new AdminEntity();

  const data: Omit<IAdmin, 'id' > = {
    lastLogin: null,
  };

  return Object.assign(entity, data);
});
