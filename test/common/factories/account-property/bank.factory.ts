import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { BankEntity } from 'src/account-property/entities/bank.entity';
import { IBank } from 'src/account-property/interfaces/bank/bank.interface';

define(BankEntity, (faker: typeof Faker) => {
  const entity = new BankEntity();

  const data: Omit<IBank, 'id'> = {
  };

  return Object.assign(entity, data);
});
