import { Seeder } from 'typeorm-seeding';
import StatusSeeder from 'test/local/seeders/01.status.seeder';

export default class StatusSeederRemote extends StatusSeeder implements Seeder {}
