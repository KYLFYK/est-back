import { Factory, Seeder } from 'typeorm-seeding';
import ConstructionProgressSeeder from 'test/local/seeders/01.construction-progress.seeder';
import { Connection } from 'typeorm';

export default class ConstructionProgressSeederRemote extends ConstructionProgressSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection) : Promise<void> {
    }
}
