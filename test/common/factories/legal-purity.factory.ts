import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { LegalPurityEntity } from 'src/leagal-purity/entities/legalPurity.entity';
import { ILegalPurity } from 'src/leagal-purity/interfaces/ILegalPurity';

define(LegalPurityEntity, (faker: typeof Faker) => {

  const entity = new LegalPurityEntity();

  const owners = []
  owners.push(`${faker.name.lastName()} ${faker.name.firstName()} ${faker.name.firstName()}`)
  if (faker.random.boolean()){
    owners.push(`${faker.name.lastName()} ${faker.name.firstName()} ${faker.name.firstName()}`)  
  }

  const data: Omit<ILegalPurity, 'id' > = {
    address: faker.address.country() + ', ' + faker.address.city() + ', ' + faker.address.streetAddress(),
    areaUnits: 'м2',
    areaValue: faker.random.number({ 'min': 20, 'max': 2000 }),
    cadastalNumber: `${faker.random.number({ 'min': 10, 'max': 99 })}:06:0009005:${faker.random.number({ 'min': 1000, 'max': 9999 })}`,
    cadastralPrice: faker.random.number({ 'min': 1000000, 'max': 20000000 }),
    floor: 1,
    currentOwnerName: `${faker.name.lastName()} ${faker.name.firstName()} ${faker.name.firstName()}`,
    currentOwnerStartDate: faker.date.past(),
    previewOwners: {
      owners: owners,
      startDate: new Date('01.01.2010'),
      finishDate: new Date(`01.01.20${faker.random.number({ 'min': 11, 'max': 22 })}`),
    },
    encumbrances: null,
    recomendations: null,
  };

  return Object.assign(entity, data);
});
