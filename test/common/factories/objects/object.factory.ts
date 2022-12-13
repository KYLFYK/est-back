import * as Faker from 'faker';
import { define, factory } from 'typeorm-seeding';

/* interfaces section */
import { IHouse } from '../../../../src/object/interfaces/house/house.interface';
import { ITownhouse } from '../../../../src/object/interfaces/townhouse/townhouse.interface';
import { ILand } from '../../../../src/object/interfaces/land/land.interface';
import { IComplex } from '../../../../src/object/interfaces/complex/complex.interface';
/* */

/* entities section */
import { HouseEntity } from '../../../../src/object/entities/house.entity';
import { TownhouseEntity } from '../../../../src/object/entities/townhouse.entity';
import { LandEntity } from '../../../../src/object/entities/land.entity';
import { ApartmentEntity } from '../../../../src/object/entities/apartment.entity';
import { ComplexEntity } from '../../../../src/object/entities/complex.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { TObjectType } from '../../../../src/object/types/TObjectType';
/* */

define(ComplexEntity, (faker: typeof Faker) => {
  const entity = new ComplexEntity();

  const data: Omit<IComplex, 'id' | 'createAt' | 'updateAt'> = {
    name: `Complex on ${faker.address.streetName()} street`,
    description: faker.lorem.text(),
    address: faker.address.country() + ', ' + faker.address.city() + ', ' + faker.address.streetAddress(),
    longitude: faker.address.longitude(),
    latitude: faker.address.latitude(),
    views: faker.random.number({ 'min': 0, 'max': 1000 }),
    country: null,
    region: null,
    city: null,
    owner: null,
    status: null,
    guides: null,
    files: null,
    readiness: null,
    favorite: null,
    constructionProgress: null,
    markAsDelete: false,
    property: null,
  };

  return Object.assign(entity, data);
});

define(HouseEntity, (faker: typeof Faker) => {
  const entity = new HouseEntity();

  const data: Omit<IHouse, 'id' | 'createAt' | 'updateAt'> = {
    name: null,
    description: null,
    address: null,
    postcode: null,
    longitude: null,
    latitude: null,
    price: null,
    views: faker.random.number({ 'min': 0, 'max': 1000 }),
    region: null,
    city: null,
    country: null,
    owner: null,
    status: null,
    complex: null,
    guides: null,
    favorite: null,
    markAsDelete: false,
    property: null,
    legalPurity: null,
    files: null,
    objectType: null,
  };

  return Object.assign(entity, data);
});

define(TownhouseEntity, (faker: typeof Faker) => {
  const entity = new TownhouseEntity();

  const data: Omit<ITownhouse, 'id' | 'createAt' | 'updateAt'> = {
    name: null,
    description: null,
    address: null,
    postcode: null,
    longitude: null,
    latitude: null,
    price: null,
    views: faker.random.number({ 'min': 0, 'max': 1000 }),
    region: null,
    city: null,
    country: null,
    owner: null,
    status: null,
    complex: null,
    guides: null,
    favorite: null,
    markAsDelete: false,
    property: null,
    legalPurity: null,
    files: null,
    objectType: null,
  };

  return Object.assign(entity, data);
});

define(LandEntity, (faker: typeof Faker) => {
  const entity = new LandEntity();

  const data: Omit<ILand, 'id' | 'createAt' | 'updateAt'> = {
    name: null,
    description: null,
    address: null,
    postcode: null,
    longitude: null,
    latitude: null,
    price: null,
    views: faker.random.number({ 'min': 0, 'max': 1000 }),
    region: null,
    country: null,
    city: null,
    owner: null,
    status: null,
    guides: null,
    favorite: null,
    markAsDelete: false,
    property: null,
    legalPurity: null,
    files: null,
    objectType: null,
  };

  return Object.assign(entity, data);
});

define(ApartmentEntity, (faker: typeof Faker) => {
  const entity = new ApartmentEntity();

  const data: Omit<IHouse, 'id' | 'createAt' | 'updateAt'> = {
    name: null,
    description: null,
    address: null,
    postcode: faker.random.number({ 'min': 100000, 'max': 999999 }),
    longitude: null,
    latitude: null,
    price: null,
    views: faker.random.number({ 'min': 0, 'max': 1000 }),
    region: null,
    country: null,
    city: null,
    owner: null,
    status: null,
    complex: null,
    guides: null,
    favorite: null,
    markAsDelete: false,
    property: null,
    legalPurity: null,
    files: null,
    objectType: null,
  };

  return Object.assign(entity, data);
});
