import { Seeder } from 'typeorm-seeding';
import NewsSubscriptionSeeder from 'test/local/seeders/04.news-subscription.seeder';

export default class NewsSubscriptionSeederRemote extends NewsSubscriptionSeeder implements Seeder {}
