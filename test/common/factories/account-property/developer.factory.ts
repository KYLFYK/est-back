import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { IDeveloper } from 'src/account-property/interfaces/developer/developer.interface';
import { DeveloperEntity } from 'src/account-property/entities/developer.entity';

define(DeveloperEntity, (faker: typeof Faker) => {
  const entity = new DeveloperEntity();

  const data: Omit<IDeveloper, 'id'> = {
    press: null,
    name: faker.company.companyName(),
    type: 'Девелоперская компания',
    logo: 'https://d3n32ilufxuvd1.cloudfront.net/55ad267d853a8ee05ba03cb2/226965/upload-9b246d20-77e5-11e5-a659-371ac3ded399.jpg',
    completedComplexAmount: faker.random.number({ 'min': 1, 'max': 20 }),
    inProgressComplexAmount: faker.random.number({ 'min': 1, 'max': 5 }),
    completedBuildingAmount: faker.random.number({ 'min': 20, 'max': 40 }),
    inProgressBuildingAmount: faker.random.number({ 'min': 5, 'max': 10 }),
    phone: null,
    address: faker.address.country() + ', ' + faker.address.city() + ', ' + faker.address.streetAddress(),
    site: faker.internet.url(),
    description: faker.lorem.text(),
    //experience: faker.random.number({"min": 0, "max": 200, precision: 0.1}),

    legalFullName: `ООО ${faker.company.companyName()}`,
    legalAddress: faker.address.country() + ', ' + faker.address.city() + ', ' + faker.address.streetAddress(),
    authorizedCapital: faker.random.number({ 'min': 10000, precision: 0.1 }),
    OKFS: faker.random.arrayElement(['Частная собственность', 'Государственная собственность', 'Муниципальная собственность', null]),
    OKOPF: faker.random.arrayElement([
      'Общество с ограниченной ответственностью',
      'Общество с дополнительной ответственностью',
      'Акционерное общество',
      null,
    ]),
    OKOGU: faker.random.arrayElement(['Организации учрежденные юридическими лицами', null]),
    INN: faker.random.number({ 'min': 100000000000, 'max': 999999999999 }),
    OGRN: faker.random.number({ 'min': 1000000000000, 'max': 9999999999999 }),
    KPP: faker.random.number({ 'min': 100000000, 'max': 999999999 }),
    OKATO: faker.random.arrayElement([
      `${faker.random.number({ 'min': 10, 'max': 99 })} 0${faker.random.number({ 'min': 10, 'max': 99 })} 000 0${faker.random.number({ 'min': 10, 'max': 99 })}`,
      null,
    ]),
    OKPO: faker.random.number({ 'min': 1000000000, 'max': 9999999999 }),
    OKTMO: faker.random.number({ 'min': 10000000000, 'max': 99999999999 }),
    status: faker.random.arrayElement([
      'Действующая',
      'Ликвидирована',
      'Прекратило деятельность при присоединении',
      null,
    ]),
    leaderName: faker.random.arrayElement(['Иванов', 'Павлов', 'Викторов']) + ' ' + faker.random.arrayElement(['Иван', 'Павел', 'Виктор']) + ' ' + faker.random.arrayElement(['Иванович', 'Павлович', 'Викторович']),
    founders: faker.random.arrayElement(['Менеджмент-Юбикс', 'ООО ФайлСтандарт', 'БилдингКонсалтинг']) + faker.random.arrayElement(['', ', HouseCompany LTD', ', ООО ЮжныеДома']),
    enterpriseSize: faker.random.number({ 'min': 0, 'max': 100000 }),
    numberOfStaff: faker.random.number({ 'min': 0, 'max': 100000 }),
    branch: faker.random.number({ 'min': 0, 'max': 100 }),
    revenue: faker.random.number({ 'min': 0, 'max': 9999999999, precision: 0.1 }),
    netProfit: faker.random.number({ 'min': -9999999999, 'max': 9999999999, precision: 0.1 }),
    netAssets: faker.random.number({ 'min': -9999999999, 'max': 9999999999, precision: 0.1 }),
    registrationDate: faker.date.past(100),
    registrationAuthorityName: faker.random.arrayElement([
      'Межрайонная ФНС России № ' + faker.random.number({ 'min': 1, 'max': 99 }),
      null,
    ]),
    registrationAuthorityAddress: faker.address.country() + ', ' + faker.address.city() + ', ' + faker.address.streetAddress(),
    registeringAuthorityLocated: faker.random.arrayElement([
      'Межрайонная Инспекция № ' + faker.random.number({ 'min': 1, 'max': 99 }),
      null,
    ]),
    mainOccupation: faker.random.arrayElement([
      'Деятельность заказчика-застройщика',
      'Деятельность генерального подрядчика',
      null,
    ]),
    extraOccupations: null,
    statistics: null,
    risks: null
  };

  return Object.assign(entity, data);
});
