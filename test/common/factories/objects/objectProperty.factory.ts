import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

/* interfaces section */
import { IApartmentProperty } from '../../../../src/object-property/interfaces/apartment/apartmentProperty.interface';
import { IHouseProperty } from '../../../../src/object-property/interfaces/house/houseProperty.interface';
import { ITownhouseProperty } from '../../../../src/object-property/interfaces/townhouse/townhouseProperty.interface';
import { IComplexProperty } from '../../../../src/object-property/interfaces/complex/complexProperty.interface';
import { ILandProperty } from '../../../../src/object-property/interfaces/land/landProperty.interface';
/* */

/* entities section */
import { ApartmentPropertyEntity } from '../../../../src/object-property/entities/apartmentProperty.entity';
import { HousePropertyEntity } from '../../../../src/object-property/entities/houseProperty.entity';
import { TownhousePropertyEntity } from '../../../../src/object-property/entities/townhouseProperty.entity';
import { ComplexPropertyEntity } from '../../../../src/object-property/entities/complexProperty.entity';
import { LandPropertyEntity } from '../../../../src/object-property/entities/landProperty.entity';
/* */

import { TRooms } from '../../../../src/object-property/types/rooms';

define(ApartmentPropertyEntity, (faker: typeof Faker) => {
  const entity = new ApartmentPropertyEntity();

  const data: Omit<IApartmentProperty, 'id' | 'createAt' | 'updateAt'> = {
    floor: null,
    totalFloor: null,
    area: null,
    livingArea: null,
    bathroomArea: null,
    kitchenArea: null,
    roomsArea: null,
    amountBedrooms: null,
    amountShowers: null,
    amountBathrooms: null,
    buildingNumber: null,
    heightCeilings: null,
    deadline: null,
    interior: null,
    infrastructure: null,
    rooms: null,
    threeD: 'https://www.youtube.com/embed/Ke3qyQYNob4',
    vr: 'https://3d-tur.ru/010/',
    constructionFeatures: null,
  };

  return Object.assign(entity, data);
});

define(HousePropertyEntity, (faker: typeof Faker) => {
  const entity = new HousePropertyEntity();

  const totalFloor = faker.random.number({ 'min': 1, 'max': 3 })
  const floors = []

  if (totalFloor >= 1) {
    floors.push({
      floor: 'Первый этаж',
      value: 'Холл, кухня-гостиная, комната, кабинет, санузел'
    })
  }
  if (totalFloor >= 2) {
    floors.push({
      floor: 'Спец этаж',
      value: '2 спальни с индивидуальными душевыми и туалетами'
    })
  }
  if (totalFloor >= 3) {
    floors.push({
      floor: 'Второй этаж',
      value: 'Терраса, 2 спальни, 2 санузла, 2 гардеробных, холл, кладовая'
    })
  }

  const constructionFeatures = []
  constructionFeatures.push({
    value: "house_type",
    title: 'Натуральные отделочные материалы позволяют дому дышать, согревают его зимой и создают прохладу летом'
  })
  constructionFeatures.push({
    value: "foundation",
    title: 'Дом построен с учетом сейсмической безопасности'
  })

  const data: Omit<IHouseProperty, 'id' | 'createAt' | 'updateAt'> = {
    totalFloor: totalFloor,
    totalArea: faker.random.number({ 'min': 1000, 'max': 2000, 'precision': 0.1 }),
    area: faker.random.number({ 'min': 700, 'max': 900, 'precision': 0.1 }),
    livingArea: faker.random.number({ 'min': 300, 'max': 600, 'precision': 0.1 }),
    landArea: faker.random.number({ 'min': 5, 'max': 100 }),
    bathroomArea: faker.random.number({ 'min': 3, 'max': 10, 'precision': 0.1 }),
    kitchenArea: faker.random.number({ 'min': 3, 'max': 10, 'precision': 0.1 }),
    amountBedrooms: faker.random.number({ 'min': 0, 'max': 3 }),
    amountShowers: faker.random.number({ 'min': 0, 'max': 2 }),
    amountBathrooms: faker.random.number({ 'min': 0, 'max': 2 }),
    rooms: faker.random.arrayElement(Object.values(TRooms)),
    infrastructure: faker.lorem.text(),
    floors: floors,
    threeD: 'https://www.youtube.com/embed/Ke3qyQYNob4',
    vr: 'https://3d-tur.ru/010/',
    constructionFeatures: constructionFeatures,
  };

  return Object.assign(entity, data);
});

define(TownhousePropertyEntity, (faker: typeof Faker) => {
  const entity = new TownhousePropertyEntity();

  const totalFloor = faker.random.number({ 'min': 1, 'max': 3 })
  const floors = []

  if (totalFloor >= 1) {
    floors.push({
      floor: 'Первый этаж',
      value: 'Холл, кухня-гостиная, комната, кабинет, санузел'
    })
  }
  if (totalFloor >= 2) {
    floors.push({
      floor: 'Спец этаж',
      value: '2 спальни с индивидуальными душевыми и туалетами'
    })
  }
  if (totalFloor >= 3) {
    floors.push({
      floor: 'Второй этаж',
      value: 'Терраса, 2 спальни, 2 санузла, 2 гардеробных, холл, кладовая'
    })
  }

  const constructionFeatures = []
  constructionFeatures.push({
    value: "house_type",
    title: 'Натуральные отделочные материалы позволяют дому дышать, согревают его зимой и создают прохладу летом'
  })
  constructionFeatures.push({
    value: "foundation",
    title: 'Дом построен с учетом сейсмической безопасности'
  })

  const data: Omit<IHouseProperty, 'id' | 'createAt' | 'updateAt'> = {
    totalFloor: totalFloor,
    totalArea: faker.random.number({ 'min': 1000, 'max': 2000, 'precision': 0.1 }),
    area: faker.random.number({ 'min': 700, 'max': 900, 'precision': 0.1 }),
    livingArea: faker.random.number({ 'min': 300, 'max': 600, 'precision': 0.1 }),
    landArea: faker.random.number({ 'min': 5, 'max': 100 }),
    bathroomArea: faker.random.number({ 'min': 3, 'max': 10, 'precision': 0.1 }),
    kitchenArea: faker.random.number({ 'min': 3, 'max': 10, 'precision': 0.1 }),
    amountBedrooms: faker.random.number({ 'min': 0, 'max': 3 }),
    amountShowers: faker.random.number({ 'min': 0, 'max': 2 }),
    amountBathrooms: faker.random.number({ 'min': 0, 'max': 2 }),
    rooms: faker.random.arrayElement(Object.values(TRooms)),
    infrastructure: faker.lorem.text(),
    floors: floors,
    threeD: 'https://www.youtube.com/embed/Ke3qyQYNob4',
    vr: 'https://3d-tur.ru/010/',
    constructionFeatures: constructionFeatures,
  };

  return Object.assign(entity, data);
});

define(ComplexPropertyEntity, (faker: typeof Faker) => {
  const entity = new ComplexPropertyEntity();

  const data: Omit<IComplexProperty, 'id' | 'createAt' | 'updateAt'> = {
    priceObjectMin: null,
    priceObjectMax: null,
    areaObjectMin: null,
    areaObjectMax: null,
    amountObjects: null,
    amountBuildings: null,
    amountFloors: null,
    heightCeilings: null,
    infrastructure: null,
  };

  return Object.assign(entity, data);
});

define(LandPropertyEntity, (faker: typeof Faker) => {
  const entity = new LandPropertyEntity();

  const data: Omit<ILandProperty, 'id' | 'createAt' | 'updateAt'> = {
    area: null,
    infrastructure: null,
  };

  return Object.assign(entity, data);
});
