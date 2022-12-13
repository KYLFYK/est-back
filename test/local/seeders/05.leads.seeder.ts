import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { LeadsEntity } from '../../../src/leads/entities/leads.entity';
import { EarlyPaymentEntity } from '../../../src/leads/entities/early.payment.entity';

export default class LeadsSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {
    const leadsFactory = factory(LeadsEntity)();
    // const earlyPaymentFactory = factory(EarlyPaymentEntity)()

    for (let i =0; i< 5; i++){
      await leadsFactory.create()
    }
  }
}
