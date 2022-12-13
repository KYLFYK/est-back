import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as faker from 'faker';

/* entities section */
import { NewsSubscriptionEntity } from 'src/news-subscription/entities/news-subscription.entity';
/* */

export default class NewsSubscriptionSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {

    const newsSubscriptionFactory = factory(NewsSubscriptionEntity)();
    await newsSubscriptionFactory.createMany(10)
    
  }
}
