import { Seeder } from 'typeorm-seeding';
import AccountSeeder from 'test/local/seeders/02.account.seeder';

export default class AccountSeederRemote extends AccountSeeder implements Seeder {}
