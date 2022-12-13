import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { IViewApplication } from 'src/view-application/interfaces/view-application.interface';
import { ViewApplicationEntity } from 'src/view-application/entities/view-application.entity';
import { TObjectType } from '../../../src/object/types/TObjectType';

define(ViewApplicationEntity, (faker: typeof Faker) => {

  const entity = new ViewApplicationEntity();

  const objectType = [TObjectType.buy, TObjectType.sale, TObjectType.rent]

  const comfortableTimeFrom = faker.date.future();
  const data: Omit<IViewApplication, 'id' | 'createAt' | 'updateAt' > = {
    name: `${faker.name.firstName()}`,
    email: faker.internet.exampleEmail(),
    phone: faker.phone.phoneNumberFormat(),
    agentName: `${faker.name.firstName()}`,
    orderType: faker.random.arrayElement(objectType),
    comfortableTimeFrom: new Date(comfortableTimeFrom.setHours(comfortableTimeFrom.getHours() + 0)),
    comfortableTimeTo: new Date(comfortableTimeFrom.setHours(comfortableTimeFrom.getHours() + 1)),
    object: null,
    status: null,
    markAsDelete: faker.random.boolean(),
  };

  return Object.assign(entity, data);
});
