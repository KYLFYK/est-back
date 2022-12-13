import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { IGuide } from '../../../src/guide/interfaces/guide.interface';
import { GuideEntity } from '../../../src/guide/entities/guide.entity';

define(GuideEntity, (faker: typeof Faker) => {
  const entity = new GuideEntity();

  const data: Omit<IGuide, 'id' > = {
    subtitle_en: null,
    subtitle_ru: null,
    type_en: null,
    type_ru: null,
    for: [],
    value: null,
  };

  return Object.assign(entity, data);
});
