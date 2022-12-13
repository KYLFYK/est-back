import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { createHash } from 'src/common/utils/util.createHash';

export default class AuthSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {

    const accounts = await connection
      .createQueryBuilder()
      .select('acc.email, acc.id')
      .from('account', 'acc')
      .getRawMany();

    const res = [];
    const privateKey = await createHash('123');

    for (const item of accounts) {
      res.push({
        publicKey: item.email,
        privateKey,
        account: item.id,
      });
    }

    await connection
      .createQueryBuilder()
      .insert()
      .into(AuthEntity)
      .values(res)
      .execute();
  }
}
