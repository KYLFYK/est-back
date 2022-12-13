import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { CityEntity } from 'src/city/entities/city.entity';
import { ICity } from 'src/city/interfaces/city.interface';
import { LeadsEntity } from '../../../src/leads/entities/leads.entity';
import { ILeads } from '../../../src/leads/interfaces/ILeads';
import { TLeadStatus } from '../../../src/leads/types/TLeadStatus';
import { EarlyPaymentEntity } from '../../../src/leads/entities/early.payment.entity';

define(LeadsEntity, (faker: typeof Faker) => {

  const entity = new LeadsEntity();
  const arr = [TLeadStatus.new, TLeadStatus.finish, TLeadStatus.in_progress]

  const data: Omit<ILeads, 'id' | 'createAt' > = {
    fio: `${faker.name.lastName()} ${faker.name.firstName()} ${faker.name.firstName()}`,
    phone: faker.phone.phoneNumberFormat(),
    email: faker.internet.exampleEmail(),
    objectId: faker.random.number(),
    status: faker.random.arrayElement(arr),
    statePrice: faker.random.number(),
    initialPayment: faker.random.number(),
    creditTerm: faker.random.number(),
    percentageRate: faker.random.number(),
    earlyPayment: [
      {
        dateOfPayment: new Date(),
        frequencyPayment: faker.random.number(),
        reduce: faker.random.number(),
        frequencyPrice: faker.random.number(),
      }
    ],
    monthlyPayment: faker.random.number(),
    creditTotal: faker.random.number(),
    percentTotal: faker.random.number(),
    monthlyIncome: faker.random.number(),
  };

  return Object.assign(entity, data);
});
