import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { CountryEntity } from "../../../src/country/entities/country.entity";

export default class CountrySeeder implements Seeder {
    public async run(factory: Factory, connection: Connection) : Promise<void> {
      const countryFactory = factory(CountryEntity)();

      for (let item of ['Россия']){
        // countryFactory.create({
        //     name: item
        // });

      }
    }
  }
