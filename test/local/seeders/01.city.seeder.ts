import { CityEntity } from "src/city/entities/city.entity";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CitySeeder implements Seeder {
    public async run(factory: Factory, connection: Connection) : Promise<void> {
      const cityFactory = factory(CityEntity)();

      // for (let item of ['Краснодар', 'Севастополь', 'Керчь', 'Симферополь', 'Сочи', 'Геленджик', 'Ялта', 'Алушта', 'Евпатория']){
      //   cityFactory.create({
      //       name: item
      //   });
      // }
    }
  }
