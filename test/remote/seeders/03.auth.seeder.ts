import { Seeder } from 'typeorm-seeding';
import AuthSeeder from 'test/local/seeders/03.auth.seeder';

export default class AuthSeederRemote extends AuthSeeder implements Seeder {}
