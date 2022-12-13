import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { INewsSubscription } from 'src/news-subscription/interfaces/news-subscription.interface';
import { NewsSubscriptionEntity } from 'src/news-subscription/entities/news-subscription.entity';

define(NewsSubscriptionEntity, (faker: typeof Faker) => {

  const entity = new NewsSubscriptionEntity();

  const data: Omit<INewsSubscription, 'id' > = {
    name: `${faker.name.firstName()}`,
    email: faker.internet.exampleEmail(),
    phone: faker.phone.phoneNumberFormat(),
  };

  return Object.assign(entity, data);
});
