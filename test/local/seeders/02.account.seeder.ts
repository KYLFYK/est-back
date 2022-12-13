import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { AccountEntity } from 'src/account/entities/account.entity';
import { TRole } from 'src/account/types/role';
import { CustomerEntity } from 'src/account-property/entities/customer.entity';
import { AdminEntity } from 'src/account-property/entities/admin.entity';
import { DeveloperEntity } from 'src/account-property/entities/developer.entity';
import { AgencyEntity } from 'src/account-property/entities/agency.entity';
import { AgentEntity } from 'src/account-property/entities/agent.entity';
import { BankEntity } from 'src/account-property/entities/bank.entity';
import * as faker from 'faker';

export default class AccountSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {
    const accountFactory = factory(AccountEntity)();
    const adminFactory = factory(AdminEntity)();
    const customerFactory = factory(CustomerEntity)();
    const bankFactory = factory(BankEntity)();

    /* Create admin accounts */
    await accountFactory.create({
      email: 'admin@mail.ru',
      role: TRole.admin,
      markAsDelete: false,
      isConfirmed: true,
      adminProperty: await adminFactory.create(),
    });
    await accountFactory.create({
      email: 'testadm123@mail.ru',
      role: TRole.admin,
      markAsDelete: false,
      isConfirmed: true,
      adminProperty: await adminFactory.create(),
    });
    /* */

    /* Create customer accounts */
    for (let c = 1; c <= 15; c++) {
      await accountFactory.create({ role: TRole.customer, customerProperty: await customerFactory.create() });
    }   
    await accountFactory.create({
      email: 'testsobst123@mail.ru',
      role: TRole.customer,
      markAsDelete: false,
      isConfirmed: true,
      customerProperty: await customerFactory.create()
    });
    /* */

    /* Create developer accounts */
    const developers = await connection
      .createQueryBuilder()
      .select('*')
      .from('developer', 'd')
      .getRawMany();

    await accountFactory.create({
      email: 'testdevel123@mail.ru',
      role: TRole.developer,
      markAsDelete: false,
      isConfirmed: true,
      developerProperty: developers[0]
    });
    developers.shift()
    for (const item of developers) {
      await accountFactory.create({ role: TRole.developer, developerProperty: item });
    }
    /* */

    /* Create agency accounts */
    let phone = faker.phone.phoneNumberFormat();
    const agencyFactory = factory(AgencyEntity)();
    await accountFactory.create({
      email: 'testagentstvo123@mail.ru',
      phone: phone,
      role: TRole.agency,
      markAsDelete: false,
      isConfirmed: true,
      agencyProperty: await agencyFactory.create({
        phone: [{ord: 1, value: phone}]
      })
    });

    const agencyCount = 5;
    for (let c = 1; c <= agencyCount; c++) {
      phone = faker.phone.phoneNumberFormat();
      await accountFactory.create({ 
        role: TRole.agency,
        phone: phone,
        agencyProperty: await agencyFactory.create({
          phone: [{ord: 1, value: phone}]
        }) 
      });
    }
    /* */

    /* Create agent accounts */
    const agentFactory = factory(AgentEntity)();
    phone = faker.phone.phoneNumberFormat();
    await accountFactory.create({
      email: 'testagent123@mail.ru',
      phone: phone,
      role: TRole.agent,
      markAsDelete: false,
      isConfirmed: true,
      agentProperty: await agentFactory.create({
        agencyId: faker.random.number({ 'min': 1, 'max': agencyCount }),
        phone: [{ord: 1, value: phone}]
      })
    });

    for (let c = 1; c <= 25; c++) {
      phone = faker.phone.phoneNumberFormat();
      await accountFactory.create({
        phone: phone,
        role: TRole.agent,
        agentProperty: await agentFactory.create({
          agencyId: faker.random.number({ 'min': 1, 'max': agencyCount }),
          phone: [{ord: 1, value: phone}]
        })
      });
    }
    /* */

    /* Create bank accounts */
    for (let b = 1; b <= 3; b++) {
      await accountFactory.create({ role: TRole.bank, bankProperty: await bankFactory.create() });
    }
    await accountFactory.create({
      email: 'testbank123@mail.ru',
      role: TRole.bank,
      markAsDelete: false,
      isConfirmed: true,
      bankProperty: await bankFactory.create()
    });
    /* */
  }

}
