import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { IAgent } from 'src/account-property/interfaces/agent/agent.interface';
import { AgentEntity } from 'src/account-property/entities/agent.entity';

define(AgentEntity, (faker: typeof Faker) => {
  const entity = new AgentEntity();

  const data: Omit<IAgent, 'id'> = {
    name: `${faker.name.lastName()} ${faker.name.firstName()} ${faker.name.firstName()}`,
    position: faker.random.arrayElement([
      'Агент',
      'Старший агент',
      'Менеджер',
      'Руководитель',
    ]),
    phone: null,
    experience: faker.date.past(50),
    rating: faker.random.number({ 'min': 1, 'max': 100 }),
    inviteLink: `${faker.internet.url()}/${faker.random.uuid()}`,
    messengers: {
      telegram: faker.phone.phoneNumber(),
      whatsApp: faker.phone.phoneNumber(),
    },
    agencyId: null,
  };

  return Object.assign(entity, data);
});
