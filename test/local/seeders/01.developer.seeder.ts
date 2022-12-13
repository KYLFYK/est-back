import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { DeveloperEntity } from 'src/account-property/entities/developer.entity';
import * as faker from 'faker';
import { PressEntity } from 'src/press/entities/press.entity';

export default class DeveloperSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {
    const developerFactory = factory(DeveloperEntity)();
    const pressFactory = factory(PressEntity)();

    const data = { 
      phone: [], 
      extraOccupations: [], 
      press: [],
      statistics: [],
      risks: []
    };

    for (let c = 1; c <= 3; c++) {

      for (let i = 1; i <= faker.random.number({ 'min': 1, 'max': 3 }); i++) {
        data.phone.push({ ord: i, value: faker.phone.phoneNumberFormat() });
      }
      for (let i = 1; i <= faker.random.number({ 'min': 0, 'max': 3 }); i++) {
        data.extraOccupations.push({
          ord: i,
          value: faker.random.arrayElement([
            'Передача электроэнергии',
            'Покупка и продажа собственного недвижимого имущества',
            'Подготовка к продаже собственного недвижимого имущества',
            'Аренда и управление собственным или арендованным недвижимым имуществом',
          ]),
        });
      }

      /* statistics */
      if (faker.random.boolean()){
        data.statistics = null  
      }
      else {
        data.statistics.push({
          title: `Арбитражные дела`,
          items: [
            {
              item: `Судебные дела`,
              value: faker.random.number({ 'min': 10, 'max': 20 })
            },
            {
              item: `В качестве истца`,
              value: faker.random.number({ 'min': 0, 'max': 5 })
            },
            {
              item: `В качестве ответчика`,
              value: faker.random.number({ 'min': 0, 'max': 5 })
            }
          ]
        })
        data.statistics.push({
          title: `Исполнительные производства`,
          items: [
            {
              item: `Текущие производства`,
              value: faker.random.number({ 'min': 0, 'max': 3 })
            },
            {
              item: `Завершенные производства`,
              value: faker.random.number({ 'min': 0, 'max': 60 })
            }
          ]
        })
        data.statistics.push({
          title: `Тендеры и госзакупки`,
          items: [
            {
              item: `Количество закупок`,
              value: faker.random.number({ 'min': 0, 'max': 200 })
            },
          ]
        })
        data.statistics.push({
          title: `Существующие события`,
          items: [
            {
              item: `За всю историю компании`,
              value: faker.random.number({ 'min': 10, 'max': 20 })
            },
            {
              item: `За текущий год`,
              value: faker.random.number({ 'min': 0, 'max': 10 })
            },
          ]
        })
        data.statistics.push({
          title: `Связи комании`,
          items: [
            {
              item: `Дочерние предприятия`,
              value: faker.random.number({ 'min': 0, 'max': 10 })
            },
            {
              item: `Совладельцы`,
              value: faker.random.number({ 'min': 0, 'max': 5 })
            },
          ]
        })        
      }
      /* */

      /* risks */
      if (faker.random.boolean()){
        data.risks = null  
      }
      else {
        data.risks.push({
          title: `Индекс должной осмотрительности`,
          description: `Оценка, показывающая вероятность того, что компания является «фирмой- однодневкой»`,
          value: faker.random.number({ 'min': 0, 'max': 20 })
        })
        data.risks.push({
          title: `Индекс финансового риска`,
          description: `Оценка вероятности неплатежеспособности компании`,
          value: faker.random.number({ 'min': 0, 'max': 20 })
        })
        data.risks.push({
          title: `Индекс платежной дисциплины`,
          description: `Показатель, отражающий своевременность оплаты компанией счетов`,
          value: faker.random.number({ 'min': 0, 'max': 20 })
        })
      }
      /* */
      
      /* press */
      for (let i = 1; i <= faker.random.number({ 'min': 0, 'max': 3 }); i++) {
        data.press.push(await pressFactory.create({
          text: `Очень интересная новость: ${faker.lorem.text()}`,
          title: `Новость ${i} про девелоперскую компанию`
        }))
      }
      /* */

      await developerFactory.create(data);

      data.phone = [];
      data.extraOccupations = [];
      data.press = [];
      data.statistics = [];
      data.risks = []
    }
  }
}
