import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { StatusEntity } from 'src/object/entities/status.entity';

export default class StatusSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {
    const statusFactory = factory(StatusEntity)();

    await statusFactory.create({ status: 'На продаже' });
    await statusFactory.create({ status: 'На бронировании' });
    await statusFactory.create({ status: 'На задатке' });
    await statusFactory.create({ status: 'ИЖС' });
    await statusFactory.create({ status: 'Перед сдачей' });
  }
}
