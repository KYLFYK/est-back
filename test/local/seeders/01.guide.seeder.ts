import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { GuideEntity } from 'src/guide/entities/guide.entity';
import { TType_en, TType_ru } from 'src/guide/types/type';
import { TFor } from 'src/guide/types/for';
import { TSubtitle_en, TSubtitle_ru } from 'src/guide/types/subtitle';

export default class GuideSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) : Promise<void> {
    const guideFactory = factory(GuideEntity)();

    /* Язык */
    for (let item of ['ru']){
      guideFactory.create({
        type_en: TType_en.lang,
        for: [TFor.house, TFor.townhouse, TFor.apartment, TFor.land],
        value: item,
      });
    }
    /* */

    /* Тип недвижимости */
    for (let item in TFor){
      guideFactory.create({
        type_en: TType_en.objectType,
        for: [TFor[item]],
        value: item,
      });
    }
    /* */

    /*  Постройка (building type) */
    for (let item of ['Новостройка', 'Вторичка']){
      guideFactory.create({
        type_en: TType_en.buildingType,
        for: [TFor.house, TFor.townhouse, TFor.apartment],
        value: item,
      });
    }
    /* */

    /* Санузел */
    for (let item of ['Раздельный', 'Совмещенный', 'Раздельный, Совмещенный']){
      guideFactory.create({
        type_en: TType_en.bathroom,
        type_ru: TType_ru.bathroom,
        for: [TFor.house, TFor.apartment],
        value: item,
      });
    }
    /* */

    /* Мебель */
    for (let item of ['Холодильник', 'Стиральная машина', 'Посудомоечная машина', 'Кондиционер', 'Телевизор', 'Мебель в комнатах']){
      guideFactory.create({
        subtitle_en: TSubtitle_en.furniture,
        subtitle_ru: TSubtitle_ru.furniture,
        type_ru: TType_ru.furniture,
        type_en: TType_en.furniture,
        for: [TFor.house, TFor.townhouse, TFor.apartment],
        value: item,
      });
    }
    /* */

    /* Вид из окна */
    for (let item of ['Парк', 'Двор', 'Море', 'Улица']){
      guideFactory.create({
        subtitle_en: TSubtitle_en.window,
        subtitle_ru: TSubtitle_ru.window,
        type_ru: TType_ru.window,
        type_en: TType_en.window,
        for: [TFor.house, TFor.townhouse, TFor.apartment],
        value: item,
      });
    }
    /* */

    /* Тип дома  */
    for (let item of ['Монолитный', 'Кирпичный', 'Монолитно-кирпичный']){
      guideFactory.create({
        subtitle_en: TSubtitle_en.CTE,
        subtitle_ru: TSubtitle_ru.CTE,
        type_en: TType_en.construction,
        type_ru: TType_ru.construction,
        for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex],
        value: item,
      });
    }

    /* Класс жилья */
    for (let item of ['Бизнес', 'Премиум', 'Комфорт']){
      guideFactory.create({
        subtitle_en: TSubtitle_ru.class,
        subtitle_ru: TSubtitle_ru.class,
        type_en: TType_en.class,
        type_ru: TType_ru.class,
        for: [TFor.complex],
        value: item,
      });
    }
    /* */

    /* Отделка */
    for (let item of ['Черновая', 'Чистовая', 'Чистовая с мебелью']){
      guideFactory.create({
        subtitle_en: TSubtitle_en.decorating,
        subtitle_ru: TSubtitle_ru.decorating,
        type_en: TType_en.decorating,
        type_ru: TType_ru.decorating,
        for: [TFor.complex],
        value: item,
      });
    }
    /* */

    /*  Парковка */
    for (let item of ['Подземеный паркинг', 'Автостоянка', 'Гостевая']){
      guideFactory.create({
        subtitle_en: TSubtitle_en.parking,
        subtitle_ru: TSubtitle_ru.parking,
        type_en: TType_en.parking,
        type_ru: TType_ru.parking,
        for: item === 'Автостоянка' ? [TFor.complex] : [TFor.complex, TFor.apartment],
        value: item,
      });
    }
    /* */

    guideFactory.create({
      subtitle_en: TSubtitle_en.CTE,
      subtitle_ru: TSubtitle_ru.CTE,
      type_en: TType_en.groundwork,
      type_ru: TType_ru.groundwork,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex],
      value: 'Ленточный',
    });

    guideFactory.create({
      subtitle_en: TSubtitle_en.CTE,
      subtitle_ru: TSubtitle_ru.CTE,
      type_ru: TType_ru.roof,
      type_en: TType_en.roof,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex],
      value: 'Черепица',
    });

    guideFactory.create({
      subtitle_en: TSubtitle_en.CTE,
      subtitle_ru: TSubtitle_ru.CTE,
      type_ru: TType_ru.wall,
      type_en: TType_en.wall,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex],
      value: 'Кирпич',
    });

    guideFactory.create({
      subtitle_en: TSubtitle_en.engineeringCommunication,
      subtitle_ru: TSubtitle_ru.engineeringCommunication,
      type_ru: TType_ru.water,
      type_en: TType_en.water,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex, TFor.land],
      value: 'Центральный',
    });

    guideFactory.create({
      subtitle_en: TSubtitle_en.engineeringCommunication,
      subtitle_ru: TSubtitle_ru.engineeringCommunication,
      type_ru: TType_ru.heating,
      type_en: TType_en.heating,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex, TFor.land],
      value: 'Газовый котёл',
    });
    guideFactory.create({
      subtitle_en: TSubtitle_en.engineeringCommunication,
      subtitle_ru: TSubtitle_ru.engineeringCommunication,
      type_ru: TType_ru.heating,
      type_en: TType_en.heating,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex],
      value: 'Центральное',
    });

    guideFactory.create({
      subtitle_en: TSubtitle_en.engineeringCommunication,
      subtitle_ru: TSubtitle_ru.engineeringCommunication,
      type_ru: TType_ru.sewerage,
      type_en: TType_en.sewerage,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex, TFor.land],
      value: 'Центральная',
    });

    guideFactory.create({
      subtitle_en: TSubtitle_en.engineeringCommunication,
      subtitle_ru: TSubtitle_ru.engineeringCommunication,
      type_ru: TType_ru.electricity,
      type_en: TType_en.electricity,
      for: [TFor.house, TFor.apartment, TFor.townhouse, TFor.complex],
      value: 'Генератор',
    });

    guideFactory.create({
      subtitle_en: TSubtitle_en.engineeringCommunication,
      subtitle_ru: TSubtitle_ru.engineeringCommunication,
      type_ru: TType_ru.internet,
      type_en: TType_en.internet,
      for: [TFor.house],
      value: 'Wi-Fi',
    });

    /* buildings */
    for (let item of ['Детские площадки', 'Места для отдыха', 'Спортивные площадки', 'Бассейн', 'Забор']){
      let listFor: TFor[];
      if (item === 'Забор'){
        listFor = [TFor.house, TFor.townhouse, TFor.complex, TFor.land]
      }
      else{
        listFor = [TFor.house, TFor.townhouse, TFor.complex, TFor.apartment]
      }
      guideFactory.create({
        subtitle_en: TSubtitle_en.territory,
        subtitle_ru: TSubtitle_ru.territory,
        type_en: TType_en.buildings,
        type_ru: TType_ru.buildings,
        for: listFor,
        value: item,
      });
    }
    /* */

    /* Безопасность */
    for (let item of ['Видеонаблюдение', 'Противопожарная система', 'Консьерж', 'Огороженный периметр', 'Пропускная система']){
      guideFactory.create({
        subtitle_en: TSubtitle_en.safety,
        subtitle_ru: TSubtitle_ru.safety,
        type_en: TType_en.safety,
        type_ru: TType_ru.safety,
        for: [TFor.house, TFor.townhouse, TFor.complex, TFor.apartment],
        value: item,
      });
    }
    /* */

    /* Статус заявки на просмотр */
    for (let item of ['Новая заявка', 'Просмотрено', 'Письмо доставлено', 'Запланирован звонок', 'Подтверждено', 'Завершено', 'Отклонено']){
      guideFactory.create({
        type_en: TType_en.viewApplicationStatus,
        for: [TFor.house, TFor.townhouse, TFor.apartment, TFor.land],
        value: item,
      });
    }
    /* */

  }
}
