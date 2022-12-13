import { RegionEntity } from "src/region/entities/region.entity";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { locations } from '../../../src/common/const/locations';
import { CityEntity } from '../../../src/city/entities/city.entity';
import { CountryEntity } from '../../../src/country/entities/country.entity';

const region = [
  'Крым',
  'Краснодарский край',
  'Москва и область'
]
export default class RegionSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection) : Promise<void> {
      const regionFactory = factory(RegionEntity)();
      const cityFactory = factory(CityEntity)();
      const countryFactory = factory(CountryEntity)();

      for (let country of locations) {

        const _country = await countryFactory.create({
          name: country.name
        })

        for(let region of country.items) {
          const _region = await regionFactory.create({
            name: region.name
          })

          for(let city of region.items) {
            await cityFactory.create({
              name: city.name,
              region: _region
            })
          }

        }



      }
      // for (let item of region){
      //   regionFactory.create({
      //       name: item
      //   });
      // }
    }
  }
