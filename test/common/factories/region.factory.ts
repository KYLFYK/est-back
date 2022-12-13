import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { RegionEntity } from 'src/region/entities/region.entity';
import { IRegion } from 'src/region/interfaces/region.interface';

define(RegionEntity, (faker: typeof Faker) => {

  const entity = new RegionEntity();

  const data: Omit<IRegion, 'id' > = {
    name: null,
  };

  return Object.assign(entity, data);
});
