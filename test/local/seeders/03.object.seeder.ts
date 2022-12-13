import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as faker from 'faker';
import { HouseEntity } from '../../../src/object/entities/house.entity';
import { TownhouseEntity } from '../../../src/object/entities/townhouse.entity';
import { LandEntity } from '../../../src/object/entities/land.entity';
import { ApartmentEntity } from '../../../src/object/entities/apartment.entity';
import { ComplexEntity } from '../../../src/object/entities/complex.entity';
import { ApartmentPropertyEntity } from '../../../src/object-property/entities/apartmentProperty.entity';
import { HousePropertyEntity } from '../../../src/object-property/entities/houseProperty.entity';
import { TownhousePropertyEntity } from '../../../src/object-property/entities/townhouseProperty.entity';
import { ComplexPropertyEntity } from '../../../src/object-property/entities/complexProperty.entity';
import { LandPropertyEntity } from '../../../src/object-property/entities/landProperty.entity';

import { generate_guides_for_object } from 'test/common/utils/generateGuide';
import { LegalPurityEntity } from 'src/leagal-purity/entities/legalPurity.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { TObjectType } from '../../../src/object/types/TObjectType';
import { ConstructionProgressEntity } from 'src/construction-progress/entities/construction-progress.entity';
import { TRooms } from 'src/object-property/types/rooms';
import { RegionEntity } from 'src/region/entities/region.entity';
import { CityEntity } from '../../../src/city/entities/city.entity';

export default class ObjectSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {

    const isObjectType = [TObjectType.sale, TObjectType.buy, TObjectType.rent];

    const customers = await connection
      .createQueryBuilder()
      .select('*')
      .from('account', 'a')
      .where('role = \'customer\'')
      .getRawMany();

    const developers = await connection
      .createQueryBuilder()
      .select('*')
      .from('account', 'a')
      .where('role = \'developer\'')
      .getRawMany();

    const agencies = await connection
      .createQueryBuilder()
      .select('*')
      .from('account', 'a')
      .where('role = \'agency\'')
      .getRawMany();

    const agents = await connection
      .createQueryBuilder()
      .select('*')
      .from('account', 'a')
      .where('role = \'agent\'')
      .getRawMany();

    const statuses = await connection
      .createQueryBuilder()
      .select('*')
      .from('status', 's')
      .getRawMany();

    const regions = await connection
      .createQueryBuilder()
      .select('*')
      .from('region', 'r')
      .getRawMany();

    const cities = await connection
      .createQueryBuilder()
      .select('*')
      .from('city', 'c')
      .getRawMany();

    const countries = await connection
      .createQueryBuilder()
      .select('*')
      .from('country', 'c')
      .getRawMany();


    const legalPurityFactory = factory(LegalPurityEntity)()

    const fileFactory = factory(FileEntity)()

    /* complex section */
    const complexFactory = factory(ComplexEntity)();
    const complexPropertyFactory = factory(ComplexPropertyEntity)();
    const constructionProgressFactory = factory(ConstructionProgressEntity)()

    const availableGuidesComplex = await connection
      .createQueryBuilder()
      .select('*')
      .from('guide', 'g')
      .where('\'complex\' = any(g.for)')
      .getRawMany();

    const mainData = [
      { name: 'ЖК Изумрудный город', city: cities.filter(item => item.name === 'Геленджик')[0], region: regions.filter(item => item.name === 'Краснодарский край')[0], address: 'ул. Мира, 44, лит.1-6', longitude: 44.572392, latitude: 38.073536 },
      { name: 'ЖК Сан-Сити', city: cities.filter(item => item.name === 'Сочи')[0], region: regions.filter(item => item.name === 'Краснодарский край')[0], address: 'Курортный просп., 108', longitude: 43.551553, latitude: 39.779772 },
      { name: 'ЖК Зенит', city: cities.filter(item => item.name === 'Ялта')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'Красноармейская ул., 36Б', longitude: 43.604178, latitude: 39.723250 },
      { name: 'ЖК «Резиденция Дипломат»', city: cities.filter(item => item.name === 'Ялта')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'Республика Крым, городской округ Ялта, посёлок городского типа Ореанда, 60Г', longitude: 44.460176, latitude: 34.142242 },
      { name: 'ЖК «More Yalta (Море Ялта)»', city: cities.filter(item => item.name === 'Ялта')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'посёлок городского типа Гурзуф, улица 60 лет СССР', longitude: 44.549489, latitude: 34.278993 },
      { name: 'ЖК «Лес»', city: cities.filter(item => item.name === 'Алушта')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'улица Глазкрицкого, 17', longitude: 44.653184, latitude: 34.398675 },
      { name: 'ЖК Виноград', city: cities.filter(item => item.name === 'Симферополь')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'улица Никанорова', longitude: 44.982471, latitude: 34.095808 },
      { name: 'ЖК «Золотые пески»', city: cities.filter(item => item.name === 'Евпатория')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'Симферопольская улица, 1', longitude: 45.190044, latitude: 33.424362 },
      { name: 'ЖК «Аю-Даг»', city: cities.filter(item => item.name === 'Алушта')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'посёлок городского типа Партенит, улица Васильченко', longitude: 44.584437, latitude: 34.345055 },
      { name: 'ЖК «Академия»', city: cities.filter(item => item.name === 'Симферополь')[0], region: regions.filter(item => item.name === 'Крым')[0], address: 'Киевский район, улица Беспалова, 110', longitude: 44.932970, latitude: 34.133978 },
    ]
    const descriptionData = [
      `В самом сердце Геленджика на улице Мира 44, раскинулся новый комплекс премиум класса «Изумрудный Город». Буквально в 70 шагах от моря расположены 5 и 6 этажные корпуса с мансардами. Комплекс выполнен в классическом стиле.`,
      `Авторский архитектурный проект, с двуобъемным фасадом и панорамными окнами, из которых открываются красивые виды на горы и море. В комплексе: Encore Fitness с 25-метровым бассейном, термальным комплексом и спа.`,
      `ЖК «Зенит» - это новый жилой комплекс продуманный до мелочей, созданный специально для вас. Социальная аудитория от годовалого малыша, до радушной бабушки, сможет найти полезное время препровождение на территории комплекса.`,
      `Резиденция «Дипломат» — уникальный проект курортной недвижимости, возведенный на южном побережье Крыма, в 4х км от Ялты. Апартаменты от 66 кв.м. с чистовой отделкой, предназначены как для временного, так и для постоянного проживания. Здесь все продумано до мелочей в соответствии с современными международными стандартами недвижимости класса DeLuxe. Архитектура комплекса выполнена в итальянском классическом стиле известным флорентийским архитектором Кристиано Бони.`,
      `Апарт-отель More. Yalta находится в живописном месте Южного побережья Крыма. Безмятежное лазурное море. Свежий горный воздух. Искрящиеся солнечные лучи в листьях вечнозеленых пальм и древних кипарисовых рощ, где возраст деревьев может доходить до 2000 лет. Отдых в одном из самых красивых мест черноморского побережья или инвестиции в будущее? Здесь не нужно выбирать, потому что мы нашли идеальное сочетание нетронутой красоты природы, возможностей для восстановления сил и заряда эмоций с лучшим сервисом.`,
      `Санаторий «Лес» находится в одном из самых живописных мест Крымского полуострова – «Профессорском уголке» города Алушта – на расстоянии 600 метров до Черного моря. Тихий район в стороне от дорог, шума и скопления людей, собственная сформированная инфраструктура, обилие зелени, горные пейзажи создают особые условия для отдыха и оздоровления.`,
      `Жилой квартал "Виноград".`,
      `Расположение, транспортная доступность. ЖК «Золотые пески» расположен в новом районе города Евпатории. Симферопольская улица, переходящая в одноименное шоссе, которое далее становится Евпаторийским шоссе, в направлении города Саки — это полоса между озером Сасык (с одной стороны) и Черным морем (со стороны новостройки). Евпатория известна своими пляжами, наилучшие из которых — песчаные, здесь находится природная широкая полоса песка на протяжении всей трассы.`,
      `Комплекс апартаментов бизнес-класса «Аю-Даг Resort & Spa» украсит поселок Партенит на берегу Черного моря. Данный жилой комплекс выделяется среди других новостроек Крыма уникальным расположением: на расстоянии менее 100 метров от прибрежной полосы, между заповедным лесом и парком «Айвазовское», вблизи знаменитой Медведь-горы (Аю-Даг), в честь которой комплекс апартаментов получил свое название. ЖК интересен видовыми апартаментами, автономными инженерными системами, собственным пляжем и яхтенным причалом, богатой инфраструктурой для отдыха и восстановления здоровья. Транспортная доступность ЖК «Аю-Даг» находится на достойном уровне. Застройщик позаботился о качественном асфальтированном проезде для автомобилистов. Жилой комплекс располагается на улице Васильченко и всего на 2 километра удален от Южнобережного шоссе, соединяющего между собой туристические центры Крыма. Поездка на автомобиле до Ялты займет 15-20 минут, до аэропорта в Симферополе – около часа (60 километров). Ближайшие остановки автобусов и троллейбусов находятся на расстоянии 1-2 километров от комплекса апартаментов. «Аю-Даг» – один из немногих жилых комплексов в данной местности, к которым можно добраться на катере или яхте.`,
      `«Академия» — многофункциональный комплекс апартаментов для временного проживания молодежи. Первый в Крыму проект по созданию полноценного кампуса со всеми условиями для комфортного обучения, общения и развития.`,
    ]
    const constructionProgressData = [
      { constructionProgress: [{ date: new Date('01.05.2018'), description: 'Продолжали работы на фасаде. Завершили кладку кирпичных стен' }] },
      { constructionProgress: [{ date: new Date('01.09.2021'), description: 'Готова к эксплуатации подземеная парковка' }, { date: new Date('05.10.2021'), description: 'Построена спортивная площадка' }] },
      { constructionProgress: [{ date: new Date('10.10.2021'), description: 'Возведен фундамент' }, { date: new Date('09.02.2022'), description: 'Продолжали работы на фасаде' }] },
      { constructionProgress: [] },
      { constructionProgress: [{ date: new Date('01/15/2018'), description: 'Подготовка строительного участка' }, { date: new Date('01/01/2019'), description: 'Черновая отделка' }, { date: new Date('01/01/2020'), description: 'Обустройство придомовой территории' }] },
      { constructionProgress: [] },
      { constructionProgress: [{ date: new Date('01/02/2022'), description: 'Возведение надземной части зданий и стилобата' }, { date: new Date('01/02/2022'), description: 'Монтаж внутренних инженерных систем' }] },
      { constructionProgress: [{ date: new Date('01/12/2018'), description: 'Армирование вертикальных конструкций' }, { date: new Date('04/26/2019'), description: 'Возведение надземной части здания' }] },
      { constructionProgress: [] },
      { constructionProgress: [] },
    ]

    const propertyData = [
      { amountBuildings: 6, amountFloors: 7 },
      { priceObjectMin: 22980000, priceObjectMax: 159840000, areaObjectMin: 38, floor: 28, amountBuildings: 1, amountObjects: 422, infrastructure: `Школы, детские сады` },
      { priceObjectMin: 7200000, priceObjectMax: 11800000, areaObjectMin: 39, amountObjects: 12, amountBuildings: 4 },
      { priceObjectMin: 19900000, priceObjectMax: 180300000, areaObjectMin: 61, amountObjects: 38, amountBuildings: 8, amountFloors: 8, heightCeilings: 3.0 },
      { priceObjectMin: 7600000, priceObjectMax: 22000000, areaObjectMin: 35, amountObjects: 89, amountBuildings: 8, amountFloors: 8 },
      { priceObjectMin: 6000000, priceObjectMax: 14000000, areaObjectMin: 28, amountObjects: 22, amountBuildings: 1, amountFloors: 4, heightCeilings: 2.5, infrastructure: `Расстояние до черного моря 8 минут` },
      { priceObjectMin: 4388000, priceObjectMax: 12900000, areaObjectMin: 35.1, areaObjectMax: 52.4, amountObjects: 52, amountBuildings: 3, amountFloors: 8, heightCeilings: 2.8, infrastructure: `Парк им. Юрия Гагарина 25 минут` },
      { priceObjectMin: 6880000, priceObjectMax: 10020000, areaObjectMin: 36, amountObjects: 83, amountBuildings: 2, amountFloors: 9, infrastructure: `Парк им. Караваева` },
      { priceObjectMin: 16170000, priceObjectMax: 126000000, areaObjectMin: 43, amountObjects: 18, amountBuildings: 2, amountFloors: 18, infrastructure: `Карасанский парк` },
      { priceObjectMin: 3600000, priceObjectMax: 4600000, areaObjectMin: 25, amountObjects: 6, amountBuildings: 4, amountFloors: 9, infrastructure: `Ботанический сад имени Н.В.Багрова` },
    ]

    for (let i = 0; i <= mainData.length - 1; i++) {

      const constructionProgress = []
      for (const cp of constructionProgressData[i].constructionProgress) {
        constructionProgress.push(await constructionProgressFactory.create(cp))
      }

      let arrFavorite = []
      for (const c of customers) {
        if (faker.random.number({ 'min': 0, 'max': 2 }) === 0) {
          arrFavorite.push(c)
        }
      }

      await complexFactory.create({
        name: mainData[i].name,
        address: mainData[i].address,
        country: countries[0],
        city: mainData[i].city,
        region: mainData[i].region,
        latitude: mainData[i].latitude,
        longitude: mainData[i].longitude,
        description: descriptionData[i],
        owner: faker.random.arrayElement(developers),
        status: faker.random.arrayElement(statuses),
        guides: generate_guides_for_object(availableGuidesComplex),
        favorite: arrFavorite,
        constructionProgress: constructionProgress,
        property: await complexPropertyFactory.create(propertyData[i]),
        objectType: TObjectType.sale,
        files: [
          await fileFactory.create(),
          await fileFactory.create(),
        ],
      });
    }
    /* */

    const complexes = await connection
      .createQueryBuilder()
      .select('*')
      .from('complex', 'c')
      .orderBy(`c.id`)
      .getRawMany();

    /* apartment section */
    const apartmentFactory = factory(ApartmentEntity)();
    const apartmentPropertyFactory = factory(ApartmentPropertyEntity)();

    const availableGuidesApartment = await connection
      .createQueryBuilder()
      .select('*')
      .from('guide', 'g')
      .where('\'apartment\' = any(g.for)')
      .getRawMany();


    for (const complex of complexes) {
      let apartmentMainData = [];
      let apartmentPropertyData = [];
      let apartmentOwnerData = [];
      switch (complex.name) {
        case "ЖК Изумрудный город":

          apartmentMainData = [
            { name: `1-комн. апартаменты, 53 м²`, address: `ул. Мира, 44лит1`, price: 17950000, description: `Просторный апартамент в двухстах метрах от городской набережной. Комплекс "Изумрудный город", один из самых востребованных и роскошных комплексов города-курорта. Закрытая охраняемая территория под постоянным видеонаблюдением, спортивная и детские площадки, места для отдыха. Ландшафтный дизайн и качественное озеленение радуют глаз жителей комплекса круглый год, а в теплое время года ко всему великолепию добавляется открытый бассейн и фонтан. Функциональность и благоустройство придомовой территории на втором плане, так как большую часть времени жильцы комплекса проводят на набережной города-курорта, которая начинается практически сразу от забора комплекса. Апартамент с качественным ремонтом, полностью укомплектован мебелью, бытовой техникой и электроникой.  Окна выходят на северо-восточную сторону, а значит палящего южного солнца будет в меру, и уже во второй половине дня можно наслаждаться видами на вечнозеленый Маркхотский хребет расположившись на лоджии. В квартирах автономное отопление, комплекс оборудован системой резервного водоснабжения на случай с водоснабжением в городе.` },
            { name: `2-комн. квартира, 50 м²`, address: `ул. Мира, 44лит1`, price: 14000000, description: `Продажа двухкомнатной квартиры на Мира в Геленджике. ЖК "Изумрудный город". Квартира с отличным ремонтом,мебелью и техникой, все остается.все в шаговой доступности,автономное отопление,вид на море.` },
            { name: `1-комн. апартаменты, 54 м²`, address: `ул. Мира, 44лит1`, price: 12000000, description: `В продаже однокомнатные апартаменты в ЖК Изумрудный Город, город-курорт Геленджик. Первая береговая линия, до набережной Геленджика 100 м! Апартаменты расположены на мансардном этаже семиэтажного дома. Вид из окон во двор. Общая площадь 54 кв.м.. Территория комплекса облагорожена, закрыта и охраняема. На территории расположены зоны отдыха, фонтан, детские и спортивные площадки, гостевой паркинг. Все объекты инфраструктуры в шаговой доступности. Автономное отопление, предчистовая отделка. Звоните, записывайтесь на просмотр!` },
            { name: `3-комн. квартира, 83 м²`, address: `ул. Мира, 44лит1`, price: 24000000, description: `Автономное отопление, газ Мебель остаётся в квартире, встроенная кухня. До моря расстояние 100 м. Закрытая охраняемая парковка, на территории бассейн, детская площадка. В связи с неблагоприятной эпидемиологической обстановкой в Российской федерации, а также руководствуясь рекомендациями Роспотребнадзора, ставим вас в известность что просмотр объектов недвижимости возможен будет с разрешения контролирующих органов. Код объекта в нашей базе: 28324` },
          ]
          apartmentOwnerData = [
            agencies[3],
            agencies[3],
            agents[0],
            agencies[0],
          ]
          apartmentPropertyData = [
            { floor: 5, totalFloor: 6, area: 53, amountBedrooms: 1, amountShowers: 1, bathroomArea: 6.3, livingArea: 18, kitchenArea: 15.6, rooms: TRooms.one, roomsArea: [18], amountBathrooms: 1, buildingNumber: 2, heightCeilings: 3.2, deadline: new Date('07/01/2020'), interior: `Апартамент с качественным ремонтом, полностью укомплектован мебелью, бытовой техникой и электроникой.`, infrastructure: `В некоторых корпусах комплекса расположены, кафе и рестораны. Супер- маркеты, как всем известные и распространенные "Магнит", так и  с уникальной группой товаров, премиум супермаркет "Табрис".`, constructionFeatures: [{"title": "Натуральные отделочные материалы позволяют дому дышать, согревают его зимой и создают прохладу летом", "value": "house_type"}] },
            { floor: 8, totalFloor: 8, area: 50, amountBedrooms: 2, rooms: TRooms.two, deadline: new Date('07/01/2020') },
            { floor: 7, totalFloor: 7, area: 54, amountBedrooms: 1, rooms: TRooms.one, amountBathrooms: 1, deadline: new Date('07/01/2020') },
            { floor: 2, totalFloor: 6, area: 83, amountBedrooms: 3, rooms: TRooms.three, amountBathrooms: 1, deadline: new Date('07/01/2020') },
          ]
          break;

        case "ЖК Сан-Сити":

          apartmentMainData = [
            { name: `3-комн. квартира, 133,1 м²`, address: `Курортный просп. 108`, price: 73370000, description: `Мечтаете жить в квартире премиум-класса с видом на Черное море? Тогда жилой комплекс Сан-Сити - то, что вы ищете. Наслаждайтесь европейским комфортом и всеми преимуществами жизни в Сочи!  Ваша квартира в Сан-Сити - это больше, чем квадратные метры. Потому что теперь вы почувствуете себя на роскошном отдыхе, даже не покидая курортного дома. Панорамные окна изображение единения с природой, открывая головокружительные виды на морские пейзажи.` },
            { name: `1-комн. квартира, 40,2 м²`, address: `Курортный просп. 108`, price: 32361000, description: `Продаётся 1-комнатная квартира в сданном доме (Дом 108), срок сдачи: III-кв. 2021, общей площадью 40.2 кв.м., на 20 этаже. Жилой комплекс под названием ЖК Сан Сити в Сочи это комфортабельные построения, которые размещены в микрорайоне "Приморье" по улице Курортный проспект. Строительство дома производится в четырехстах метрах от морского берега и удобного пляжа. На пляж реально добраться при помощи фуникулера, что входит в состав застройки.` },
            { name: `Квартира свободной планировки, 98,7 м²`, address: `Курортный просп. 108`, price: 285000000, description: `Комплекс класса De Luxe с лучшей панорамой на Море и зелень парков. ` },
          ]
          apartmentOwnerData = [
            agencies[2],
            developers[0],
            agencies[4],
          ]
          apartmentPropertyData = [
            { floor: 15, totalFloor: 28, area: 133.1, livingArea: 75, roomsArea: [25, 25, 25], amountBedrooms: 3, rooms: TRooms.three, deadline: new Date('10/01/2020') },
            { floor: 20, totalFloor: 28, area: 40.2, amountBedrooms: 1, rooms: TRooms.one, deadline: new Date('10/01/2020') },
            { floor: 21, totalFloor: 28, area: 98.7, rooms: TRooms.free_plan, deadline: new Date('10/01/2020') },
          ]
          break;

        case "ЖК Зенит":

          apartmentMainData = [
            { name: `1-комн. квартира, 43,62 м²`, address: `ул. Красноармейская`, price: 76000000, description: `Продаётся 1-комнатная квартира в строящемся доме (ПК4), срок сдачи: I-кв. 2023, общей площадью 43.62 кв.м., на 8 этаже. ЖК "Зенит" - это новый жилой комплекс продуманный до мелочей, созданный специально для вас. Социальная аудитория от годовалого малыша, до радушной бабушки, сможет найти полезное время препровождение на территории комплекса. "ЗЕНИТ" это жилой комплекс комфорт-класса со встроенными коммерческими помещениями. Во дворе комплекса предусматривается размещение парковочных мест, детских игровых площадок, зон отдыха и озеленения.` },
            { name: `2-комн. квартира, 65,06 м²`, address: `ул. Красноармейская`, price: 113000000, description: `Продаётся 2-комнатная квартира в строящемся доме (ПК3), срок сдачи: I-кв. 2023, общей площадью 65.06 кв.м., на 6 этаже. ЖК "Зенит" - это новый жилой комплекс продуманный до мелочей, созданный специально для вас. Социальная аудитория от годовалого малыша, до радушной бабушки, сможет найти полезное время препровождение на территории комплекса. "ЗЕНИТ" это жилой комплекс комфорт-класса со встроенными коммерческими помещениями. Во дворе комплекса предусматривается размещение парковочных мест, детских игровых площадок, зон отдыха и озеленения.` },
            { name: `1-комн. квартира, 47,23 м²`, address: `ул. Красноармейская`, price: 83000000, description: `Продаётся 2-комнатная квартира в строящемся доме (ПК3), срок сдачи: I-кв. 2023, общей площадью 65.06 кв.м., на 6 этаже. ЖК "Зенит" - это новый жилой комплекс продуманный до мелочей, созданный специально для вас. Социальная аудитория от годовалого малыша, до радушной бабушки, сможет найти полезное время препровождение на территории комплекса. "ЗЕНИТ" это жилой комплекс комфорт-класса со встроенными коммерческими помещениями. Во дворе комплекса предусматривается размещение парковочных мест, детских игровых площадок, зон отдыха и озеленения.` },
          ]
          apartmentOwnerData = [
            developers[1],
            developers[1],
            developers[1],
          ]
          apartmentPropertyData = [
            { floor: 8, totalFloor: 13, area: 43.62, livingArea: 16.95, kitchenArea: 14.56, bathroomArea: 4.59, amountBedrooms: 1, roomsArea: [16.95], rooms: TRooms.one, deadline: new Date('04/01/2023') },
            { floor: 6, totalFloor: 13, area: 65.06, livingArea: 32.88, kitchenArea: 13.60, bathroomArea: 1.81, amountBedrooms: 2, amountShowers: 1, amountBathrooms: 1, roomsArea: [12.92, 19.96], rooms: TRooms.two, deadline: new Date('04/01/2023') },
            { floor: 2, totalFloor: 13, area: 47.23, livingArea: 16.59, kitchenArea: 13.13, bathroomArea: 4.24, amountBedrooms: 1, amountBathrooms: 1, roomsArea: [16.59], rooms: TRooms.one, deadline: new Date('04/01/2023') },
          ]
          break;

        case "ЖК «Академия»":

          apartmentMainData = [
            { name: `Студия, 24,6 м²`, address: `р-н Киевский, Академия жилой комплекс`, price: 3690000, description: `Продаётся студия в строящемся доме (К-4), срок сдачи: II-кв. 2022, общей площадью 24.6 кв.м., на 1 этаже. ОБ АПАРТАМЕНТАХ. Высота потолков 2,7 м. Электро-, водоснабжение, водоотведение, центральное отопление от собственных котельных, интернет. О КОМПЛЕКСЕ. "Академия" включает 4 девятиэтажных дома в современном стиле. Особенностью комплекса является общий наземный этаж  стилобат. Внутри него разместятся необходимые объекты инфраструктуры. Современные охранные системы, круглосуточный пульт охраны и камеры видеонаблюдения. БЛАГОУСТРОЙСТВО. На крыше стилобата будут лаунж-кафе и открытые спортивные площадки: универсальные для игры в баскетбол, мини-футбол, волейбол и бадминтон, для силовой гимнастики, для йоги, для настольного тенниса; скалодром, выполненный в торце одного из корпусов во всю его высоту. Озеленение составит более 30% общей площади участка. Территория комплекса и прилегающая городская среда запроектированы с большим количеством скамеек и урн, установкой public-art-объектов. ПАРКИНГ. Внутри комплекса появится свободная пешеходная зона, свободная от автомобилей. Для организации бизнеса будут созданы специальные подъездные пути. Просторная открытая парковка будет за пределами внутреннего двора. Плюс экопарковка на 136 мест. МЕСТОРАСПОЛОЖЕНИЕ. "Академия" расположилась в одном из самых чистых районов Симферополя, между ул. Беспалова и пр. Вернадского. В нескольких минутах ходьбы: КФУ им. Вернадского; пляж Симферопольского водохранилища; парковая зона и озеро. ИНФРАСТРУКТУРА: супермаркеты, рынок, множество магазинов, салоны красоты, тренажерные залы, кафе, поликлиника. Кроме того, в стилобатной части самого комплекса разместятся  магазины, отделение банка, химчистка, аптека, стоматология. УСЛОВИЯ ОПЛАТЫ. Продажа напрямую от застройщика по ФЗ-214.` },
            { name: `Студия, 25 м²`, address: `р-н Киевский, Академия жилой комплекс`, price: 3690000, description: `Продаётся студия в строящемся доме (К-4), срок сдачи: II-кв. 2022, общей площадью 24.6 кв.м., на 1 этаже. ОБ АПАРТАМЕНТАХ. Высота потолков 2,7 м. Электро-, водоснабжение, водоотведение, центральное отопление от собственных котельных, интернет. О КОМПЛЕКСЕ. "Академия" включает 4 девятиэтажных дома в современном стиле. Особенностью комплекса является общий наземный этаж  стилобат. Внутри него разместятся необходимые объекты инфраструктуры. Современные охранные системы, круглосуточный пульт охраны и камеры видеонаблюдения. БЛАГОУСТРОЙСТВО. На крыше стилобата будут лаунж-кафе и открытые спортивные площадки: универсальные для игры в баскетбол, мини-футбол, волейбол и бадминтон, для силовой гимнастики, для йоги, для настольного тенниса; скалодром, выполненный в торце одного из корпусов во всю его высоту. Озеленение составит более 30% общей площади участка. Территория комплекса и прилегающая городская среда запроектированы с большим количеством скамеек и урн, установкой public-art-объектов. ПАРКИНГ. Внутри комплекса появится свободная пешеходная зона, свободная от автомобилей. Для организации бизнеса будут созданы специальные подъездные пути. Просторная открытая парковка будет за пределами внутреннего двора. Плюс экопарковка на 136 мест. МЕСТОРАСПОЛОЖЕНИЕ. "Академия" расположилась в одном из самых чистых районов Симферополя, между ул. Беспалова и пр. Вернадского. В нескольких минутах ходьбы: КФУ им. Вернадского; пляж Симферопольского водохранилища; парковая зона и озеро. ИНФРАСТРУКТУРА: супермаркеты, рынок, множество магазинов, салоны красоты, тренажерные залы, кафе, поликлиника. Кроме того, в стилобатной части самого комплекса разместятся  магазины, отделение банка, химчистка, аптека, стоматология. УСЛОВИЯ ОПЛАТЫ. Продажа напрямую от застройщика по ФЗ-214.` },
          ]
          apartmentOwnerData = [
            developers[0],
            developers[0],
          ]
          apartmentPropertyData = [
            { floor: 1, totalFloor: 9, area: 24.6, livingArea: 14, kitchenArea: 4, bathroomArea: 3.20, amountBedrooms: 1, roomsArea: [14], rooms: TRooms.studio, deadline: new Date('07/01/2022') },
            { floor: 1, totalFloor: 9, area: 25.0, livingArea: 14.4, kitchenArea: 4, bathroomArea: 3.20, amountBedrooms: 1, roomsArea: [14.4], rooms: TRooms.studio, deadline: new Date('07/01/2022') },
          ]
          break;

      }
      for (let i = 0; i <= apartmentMainData.length - 1; i++) {
        let arrFavorite = []
        for (const c of customers) {
          if (faker.random.number({ 'min': 0, 'max': 2 }) === 0) {
            arrFavorite.push(c)
          }
        }
        await apartmentFactory.create({
          region: complex.region,
          city: complex.city,
          country: countries[0],
          name: apartmentMainData[i].name,
          description: apartmentMainData[i].description,
          address: apartmentMainData[i].address,
          longitude: complex.longitude,
          latitude: complex.latitude,
          price: apartmentMainData[i].price,
          owner: apartmentOwnerData[i],
          guides: generate_guides_for_object(availableGuidesApartment.filter(item => item.value !== 'Вторичка')),
          favorite: arrFavorite,
          status: faker.random.arrayElement(statuses),
          complex: complex,
          property: await apartmentPropertyFactory.create(apartmentPropertyData[i]),
          files: [
            await fileFactory.create(),
            await fileFactory.create(),
          ],
          objectType: complex.objectType,
        });
      }

    }

    for (const city of cities) {
      let region: RegionEntity;
      let name = [];
      let description: Array<string>;
      let address: Array<string>;
      let longitude: Array<number>;
      let latitude: Array<number>;
      let price: Array<number>;
      let property: Array<object>;
      let objectType: Array<TObjectType>;
      if (city.name === 'Краснодар') {
        region = regions.filter(item => item.name === 'Краснодарский край')[0];
        name = [
          '2-комн. квартира, 68 м²',
          'Квартира мечты ждет вас',
          'Сдается без залога',
          '2-комн. квартира, 45 м²',
          'Без залога! Можно с кошкой!',
        ]
        description = [
          'Продается двухкомнатная квартира ,расположенная в самом сердце Краснодара, рядом с  Парком Галицкого . Идеальное  расположение дома позволяет быстро добраться в любую точку города ( рядом северные мосты)! Квартира просторная  (распашонка) ,с очень удачной планировкой .Комнаты изолированы ,окна выходят на две стороны .Сан.узел отдельный .Огромная ,удобная кухня ,с выходом на балкон, второй балкон в спальне .Просторный хол,высокие потолки .Возможно сделать перепланировку под себя, квадратура и нынешняя планировка позволяют делать все.Квартира уютная,светлая и очень просторная.Тихий двор и хорошие соседи .Можно сразу выходить на сделку - один взрослый хозяин, без обременений!Возможна ипотека!',
          'Продам 1 к. квартиру 43.4 м2. Собственник, без ипотек и обременений. Вся сумма в договоре. Блочный - мега тёплый дом/ соседи славяне. 4 квартиры на площадке, два лифта. 40 летия Победы/В.-Кругликовская. Уникальная локация - район в котором хочется жить. Новая дорога 40 лет Победы, до парка Галицкого 15 минут неспешным шагом. Два дет.сада во дворе, новая школа через дорогу. Просторные дворы с детскими площадками. Всегда есть место для парковки. Локация уникальна: Ярмарки, Магнит семейный и Гипермаркет, Пятёрочка, Патрик&Мари, ДНС, есть всё!',
          'Сдаётся просторная 1-комнатная квартира с лоджией, смежным санузлом и евроремонтом в ЖК Краснодарский. Без депозита! Коммунальные платежи и счётчики оплачиваются отдельно. Квартира оснащена кухонным гарнитуром, есть плита, кондиционер, телевизор, микроволновка, утюг, стиральная машина, холодильник. Можно обсудить покупку стиральной машины и кондиционера. Интернет проведён, есть роутер. Окна выходят во двор. Можно с заселиться с домашним питомцем. Около дома есть бесплатная парковка. Придомовая территория находится под охраной. Дом расположен в районе с развитой инфраструктурой, в пешей доступности находятся: остановки общественного транспорта, продуктовые магазины, аптеки, фитнес-клуб, салон красоты, почта. До ТРЦ Красная Площадь  15 минут на машине.',
          'Арт. 31306132 Сдам новую квартиру в Центре Краснодара на ул. Шоссе Нефтяников. В квартире свежий ремонт. Есть вся необходимая бытовая техника и мебель. Никто не жил! Застекленный балкон. Территория дома находится под видеонаблюдением, огорожена, имеется комфортная современная детская площадка. Рядом развитая инфраструктура.',
          'Сдаётся светлая 2-комнатная квартира с евроремонтом, 2 санузлами и лоджией в ЖК Квартал 6, без депозита! Коммунальные услуги и счётчики оплачиваются отдельно. Квартира оборудована кухонным гарнитуром, мебелью и бытовой техникой. Есть холодильник, стиральная машина и плита. Проведён интернет, полы  ламинат и плитка. Возможен торг',
        ]
        address = [
          'Школьная улица, 5',
          'ул. Имени 40-летия Победы, 101',
          'ул. Краеведа Соловьева, 2к2',
          'улица Шоссе Нефтяников, 22к2',
          'ул. Имени Героя Советского Союза Николая Воробьева, 11',
        ]
        longitude = [
          45.036604,
          45.058816,
          45.088815,
          45.066354,
          45.062095
        ]
        latitude = [
          39.017893,
          39.029625,
          39.046127,
          38.983964,
          39.056629
        ]
        price = [
          7000000,
          4300000,
          16000,
          26000,
          24100
        ],
        property = [
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 68, livingArea: 31, bathroomArea: 8, kitchenArea: 15.6, roomsArea: [16.5, 14.5], amountBedrooms: 2, amountShowers: 1, amountBathrooms: 1, buildingNumber:1, heightCeilings: 3, rooms: TRooms.two, interior: "Две красивые спальные комнаты. Ремонт в одной был 1 месяц назад, в другой - 2 года назад. Удобная мебель. Есть вся техника", infrastructure: 'В 2 минутах находятся 2 школы. В 5 минутах - детский сад. Много продуктовых магазинов в радиусе 200м. Есть спортплощадка во дворе', constructionFeatures: [{"title": "Натуральные отделочные материалы позволяют дому дышать, согревают его зимой и создают прохладу летом", "value": "house_type"}] },
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 43.4, livingArea: 22.7, kitchenArea: 10.1, amountBedrooms: 1, rooms: TRooms.one, heightCeilings: 2.6 },
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 40.3, livingArea: 20, kitchenArea: 12, amountBedrooms: 1, rooms: TRooms.one, heightCeilings: 2.7 },
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 45, livingArea: 22, kitchenArea: 12, amountBedrooms: 1, rooms: TRooms.one },
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 60.5, livingArea: 34, kitchenArea: 17, amountBedrooms: 2, amountBathrooms: 2, rooms: TRooms.two, roomsArea: [19, 15] },
        ],
        objectType = [
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          TObjectType.rent,
          TObjectType.rent,
          TObjectType.rent,
        ]
      }
      else if (city.name === 'Ялта') {
        region = regions.filter(item => item.name === 'Крым')[0];
        name = [
          'Элитный ЖК, вид на море/горы',
          '1-комн. квартира, 12 м²',
          'Уютная квартира в хорошем районе',
          'Решение для большой семьи',
          '2-комн. квартира, 62,2 м²'
        ]
        description = [
          'Сдается в аренду 3-х комнатная квартира в закрытом ЖК "Шато Ришелье". В квартире сделан дизайнерский ремонт в классическом стиле. Имеются все необходимые удобства, включая скоростной интернет, современный мультимедийный центр (smart TV), винный шкаф, (2 на 2 метра) ортопедический матрас,  2 ванные, стиральную/сушильную машины. Есть балкон и большая лоджия с видом на горы и море. В стоимость аренды входит машиноместо площадью 15 кв.м.',
          'Предложение ограничено. СДАЁТСЯ НА ДЛИТЕЛЬНЫЙ СРОК. Уютное гнёздышко по ул. Строителей 3',
          'Аренда квартиры в центре города с Качественным Сервисом.',
          'Квартира для большой семьи или для тех кто любит простор и тишину!',
          'Двухкомнатная квартира 62,2 м2, на первом этаже восьмиэтажного дома. Расположена в Республике Крым, г. Ялта, улица Тимирязева. Первый высокий этаж с видом на море и горы. Возможен показ в режиме online.',
        ]
        address = [
          'Ялтинская улица, 16А',
          'улица Строителей, 3',
          'улица Руданского, 8Б',
          'улица Свердлова, 48Ак1',
          'улица Тимирязева, 37',
        ]
        longitude = [
          44.550556,
          44.548596,
          44.498411,
          44.510902,
          44.498257
        ]
        latitude = [
          34.288425,
          34.286799,
          34.172893,
          34.177681,
          34.140975
        ]
        price = [
          75000,
          15000,
          28000,
          27000000,
          7450000
        ],
        property = [
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 97.7, kitchenArea: 12, amountBedrooms: 3, rooms: TRooms.three, heightCeilings: 3 },
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 12, amountBedrooms: 1, rooms: TRooms.one },
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 47, livingArea: 42, amountBedrooms: 1, rooms: TRooms.studio },
          { floor: faker.random.number({ 'min': 1, 'max': 5 }), totalFloor: faker.random.number({ 'min': 5, 'max': 15 }), area: 120, livingArea: 83, kitchenArea: 22, amountBedrooms: 4, rooms: TRooms.four, heightCeilings: 2.5, roomsArea: [25, 25, 15, 18] },
          { floor: 1, totalFloor: 8, area: 62.2, livingArea: 31.6, kitchenArea: 9.3, amountBedrooms: 2, rooms: TRooms.two },
        ],
        objectType = [
          TObjectType.rent,
          TObjectType.rent,
          TObjectType.rent,
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        ]
      }
      for (let i = 0; i <= name.length - 1; i++) {
        let arrFavorite = []
        for (const c of customers) {
          if (faker.random.number({ 'min': 0, 'max': 2 }) === 0) {
            arrFavorite.push(c)
          }
        }
        await apartmentFactory.create({
          region: region,
          city: city,
          name: name[i],
          description: description[i],
          address: address[i],
          longitude: longitude[i],
          latitude: latitude[i],
          price: price[i],
          owner: faker.random.arrayElement(customers),
          guides: generate_guides_for_object(availableGuidesApartment.filter(item => item.value !== 'Новостройка')),
          favorite: arrFavorite,
          status: faker.random.arrayElement(statuses),
          property: await apartmentPropertyFactory.create(property[i]),
          files: [
            await fileFactory.create(),
            await fileFactory.create(),
          ],
          objectType: objectType[i],
          legalPurity: await legalPurityFactory.create({
            recomendations: [{
              title: 'Квартира в собственности менее 5 лет',
              description: 'При продаже продавец скорее всего должен будет заплатить налог с её продажи'
            }],
            encumbrances: [
              {
                title: 'На квартиру наложен арест',
                description: 'На квартиру наложен арест (описание)',
                status: true,
              },
              {
                title: 'Записей об аренде не найдено',
                description: null,
                status: false,
              }
            ]
          }),
          
        });
      }
    }
    
    /* house + townhouse section */
    for (const ent of ['house', 'townhouse']){
      let houseFactory;
      let housePropertyFactory;
      if (ent === 'house'){
        houseFactory = factory(HouseEntity)();
        housePropertyFactory = factory(HousePropertyEntity)();
      }
      else if (ent === 'townhouse'){
        houseFactory = factory(TownhouseEntity)();
        housePropertyFactory = factory(TownhousePropertyEntity)();
      }
      
  
      const availableGuidesHouse = await connection
        .createQueryBuilder()
        .select('*')
        .from('guide', 'g')
        .where('\'house\' = any(g.for)')
        .getRawMany();
  
        
      const name = [
        'Дом в Ялте от собственника',
        'Продам дом у моря',
        '3-этажный коттедж, 440 м² в посёлке «Коттеджный поселок в Симеизе»',
        'Коттедж Ялта 280м2. До моря 50 м!',
        'Дом с панорамными видами',
        'Дом с видом на горы',
        '2-этажный коттедж, 190 м²',
        'Дом, 35 м²',
        'Дом, 80 м²',
        '2-этажный дом, 250 м²',
        '1-этажный дом, 52 м²',
        '1-этажный дом, 47 м²',
        '1-этажный дом, 70 м²',
        '2-этажный дом, 81 м²',
      ]
      const regionsData = [
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Краснодарский край')[0],
        regions.filter(item => item.name === 'Краснодарский край')[0],
        regions.filter(item => item.name === 'Краснодарский край')[0],
        regions.filter(item => item.name === 'Краснодарский край')[0],
        regions.filter(item => item.name === 'Краснодарский край')[0],
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Крым')[0],
        regions.filter(item => item.name === 'Крым')[0],
      ]
      const citiesData = [
        cities.filter(item => item.name === 'Ялта')[0],
        cities.filter(item => item.name === 'Ялта')[0],
        cities.filter(item => item.name === 'Ялта')[0],
        cities.filter(item => item.name === 'Ялта')[0],
        cities.filter(item => item.name === 'Сочи')[0],
        cities.filter(item => item.name === 'Сочи')[0],
        cities.filter(item => item.name === 'Сочи')[0],
        cities.filter(item => item.name === 'Сочи')[0],
        cities.filter(item => item.name === 'Сочи')[0],
        cities.filter(item => item.name === 'Керчь')[0],
        cities.filter(item => item.name === 'Керчь')[0],
        cities.filter(item => item.name === 'Керчь')[0],
        cities.filter(item => item.name === 'Керчь')[0],
        cities.filter(item => item.name === 'Керчь')[0],
      ]
      const description = [
        'Любая форма оплаты (нал., безнал на р/с ИП). Продается индивидуальный жилой дом, площадью 90 кв.м. расположенный в г. Ялта, на земельном участке площадью 400 кв.м. Построен строительной компанией "СК"АРХИТЕК".',
        'Продается 2х этажный дом у моря от собственника. Самый лучший пляж Крыма. Дом из газоблока, фундамент свайно-ростверковый с монолитной плитой. Водоснабжение центральное, отопление водяной теплый пол, канализация септик. С балкона прекрасный вид на море. Дом с предчистовой отделкой. Сантехника электрика готовы. Фото могу отправить лично.',
        'Продается жилой дом в коттеджном поселке в Симеизе для людей ценящих качество строительства. Площадь дома без учета террас и балконов 440 м2. Площадь земельного участка 24 сотки. Прилегает к Милютинскому парку. До моря 300 м.',
        'Вашему вниманию предлагается к продаже шикарный коттедж площадью 280 м2 в самом сердце Крымского полуострова в Ялте. Вся инфраструктура рядом, до моря всего 40 метров. Качественный дизайнерский ремонт, красивая и функциональная мебель, современная техника/мультимедиа. В каждой локации кондиционер, большой 65 дюймовый телевизор 4К с НТВ+, приставка Apple TV на всей территории устойчивый Wi-Fi, внешнее видеонаблюдение, сигнализация, ip-домофон управление с iOS, android, с приемными панелями на первом ярусе и на террасе, электромеханический замок - открытие входной дверей с брелока (4 брелока). Вся техника управляется с iOS! Устанавливайте соответствующие приложения и пульты вам не нужны. Гостиная. Гостиная-студия с выходом на балкон и проходом в спальню, две кухни со всей встроенной техникой, в том числе большой холодильник Side-by-side на кухне первого яруса. Спальни. Три большие спальни, одна на первом ярусе с выходом на балкон и две на втором, большие, дорогие кровати (240Х210Х56 см), шторы блэк-аут, современные материалы, дизайн. Сан узлы. Три санузла с аудиоподготовкой, фенами, полотенцами, халатами, душ на террасе. Терраса. На втором этаже выход на террасу, площадь террасы около 100м2. На террасе полноценная летняя кухня с встроенной бытовой техникой, большой 65 дюймовый телевизор с НТВ+, 6-ть больших, двух полосных, влагозащищенных яхтных колонок, аудио ресивер ONKYO поддержка до 11.2, Apple TV, итальянская мебель из ротанга, шезлонги. Подсветка RGB по периметру террасы поможет создать подходящее настроение.',
        'Представлен к продаже дом с шикарными панорамными видами на море и Сириус и Олимпийский парк. 10 соток земли, 3 этажа, общая площадь 350м2 плюс две видовые площадки (60м2). На подъезде к дому гараж на 3 автомобиля (в цоколе), выделено и сделано место под бассейн (10м2) и джакузи с подведенными коммуникациями. Есть зеленая площадка для зоны барбекю.',
        'Продается трехэтажный дом в тихом, живописном месте в 30 минутах езды от центральной набережной Сочи и 20 минут до центрального пляжа Дагомыса, с чистым морем и благоустроенным берегом.',
        'Усадьба расположена в тихом лесном районе Сочи, на берегу реки и недалеко от моря, хорошая транспортная доступность и близость торговых точек.',
        'На участке 8 соток. Двухэтажный коттедж с собственной территорией. Прекрасный вид из окон, за забором лес, на территории дома детская площадка, парковка, зона барбекю. Спутниковое тв, высокоскоростной интернет, видеонаблюдение. Оплата в месяц + к/у, залог.',
        'Сдаётся 3-х этажный дом на длительный срок без повышения стоимости на лето. Дом расположен в нац.парке, экологически чистый район, в окружении год и леса. В пешей доступности рынок, школа, детский сад, минимаркеты, остановка общественного транспорта, новый Терренкур. До моря на автомобиле 3-5 минут, до центра Сочи 10 минут.',
        'Предлагаем к продаже двухэтажный дом, расположенный по ул. Нижне-Садовой, район Мичурино. Общая площадь дома 250 кв.м., состоит из пяти комнат, кухни-столовой. Имеется два сан. узла, установлено автономное газовое отопление. Состояние дома хорошее жилое, во дворе есть гараж. Мебель остаётся по договорённости. Земельный участок ухоженный, общей площадью 14 соток, в собственности. Реальному покупателю возможен торг.',
        'Предлагаем к продаже дом ,расположенный на земельном участке 740 кв. м .Дом требует ремонта, на участок заведена вода ,свет, газ проходит по улице ,есть бассейн для хранения воды. Участок угловой, большая при дворовая территория с двух сторон от дороги. Дом расположен в тихом спальном районе, до остановки общественного транспорта 10 минут пешим ходом, также до магазинов ,почты, до моря 10-20 минут пешим ходом. Один собственник, право собственности на дом и земельный участок зарегистрировано в ЕГРН. Возможна продажа с использованием средств материнского капитала, торг, кадастровый номер участка 90:196010116:7929',
        'Предлагаем к продаже домовладение, расположенное  в спальном районе Автовокзала, по ул. Левина. Домовладение состоит из жилого дома, жилой газифицированной летней кухни, каменного гаража, котельной и др. построек, площадь земельного участка 7,5 соток, в частной собственности. Общая площадь жилого дома 47 кв..м, состоит из двух смежных комнат, кухни, коридора, сан. узла. Состояние дома жилое, но требует косметического ремонта, окна - частично стеклопакеты. Дом газифицирован, автономное газовое отопление (двухконтурный котёл). Свет и вода заведены в дом, канализация -септик. Участок ровный прямоугольной формы, много фруктовых плодоносящих деревьев. Улица асфальтированная, в пешей доступности Автовокзал, рынок, магазины, дет. сад.',
        'Предлагаем к продаже частное домовладение, расположенное в центральной части города. ост. Оптика, район Гагаринского кольца. Общая площадь дома 70 кв..м, состоит их двух смежных комнат, кухни- столовой 20 кв.м., совмещённого сан. узла 5 кв..м, облицован кафельной плиткой, установлена душевая кабинка, крытой застеклённой террасой площадью 8 кв..м,. Дом в отличном жилом состоянии, газифицирован, автономное газовое отопление ( двухконтурный газовый котёл), окна - стеклопакеты. Земельный участок площадью 8 соток находится в частной собственности, красиво благоустроен, молодой плодоносящий фруктовый сад, цветники, двор уложен тротуарной плиткой, есть мангальная зона с беседкой. Отличное место расположение дома в шаговой доступности супер маркет " ПУД", остановки школа 5, магазины. аптеки',
        'Сдаётся двухэтажный дом в районе Войкова, остановка "Промбаза", для рабочих бригад до десяти человек и организаций, есть всё необходимое для комфортного проживания, автономное отопление, кондиционеры, постельное бельё, душ и туалет в доме, возле дома зона барбекю, возможен безналичный расчёт.',
      ]
      const address = [
        'улица Субхи, 21А',
        '4-я Садовая улица',
        'улица Михаила Баранова, 4',
        'улица Игнатенко',
        'Ворошиловградская улица, 233Б',
        'Просторная улица, 17/2',
        'село Барановка',
        'Васильковый переулок',
        'СТ БФО Мацеста-1',
        'Нижне-Садовая улица',
        'улица Провалова, 47',
        'улица Левина',
        '1-й переулок Щорса',
        'СПК Портовик-Керчь, 131',
      ]
      const longitude = [
        '44.522793',
        '45.251094',
        '44.408098',
        '44.496862',
        '43.417090',
        '43.664106',
        '43.648212',
        '43.424850',
        '43.576415',
        '45.357131',
        '45.351900',
        '45.368657',
        '45.368384',
        '45.371842',
      ]
      const latitude = [
        '34.168787',
        '33.353315',
        '34.023359',
        '34.172039',
        '39.982208',
        '39.712749',
        '39.745151',
        '39.999949',
        '39.810522',
        '36.405979',
        '36.574925',
        '36.460273',
        '36.488201',
        '36.514711',
      ]
      const price = [
        20500000,
        7800000,
        50000000,
        82500000,
        108000000,
        31000000,
        120000,
        34000,
        60000,
        12000000,
        2200000,
        4200000,
        6800000,
        45000,
      ]
      const property = [
        { totalFloor: 1, area: 91, landArea: 400, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 2, amountShowers: null, amountBathrooms: 1, infrastructure: null, rooms: TRooms.two, floors: [{ "floor": "Первый этаж", "value": "Холл, кухня-гостиная, 2 спальни, санузел" }] },
        { totalFloor: 2, area: 100, landArea: 800, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 3, amountShowers: null, amountBathrooms: 1, infrastructure: null, rooms: TRooms.two, floors: [{ "floor": "Первый этаж", "value": "Холл, кухня-гостиная, 2 спальни, санузел" }, { "floor": "Второй этаж", "value": "Спальня" }] },
        { totalFloor: 3, area: 440, landArea: 2400, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 6, amountShowers: null, amountBathrooms: 2, infrastructure: null, rooms: TRooms.six, floors: [{ "floor": "Первый этаж", "value": "Холл, кухня-гостиная, 3 спальни, санузел" }, { "floor": "Второй этаж", "value": "Спальня" }, { "floor": "Третий этаж", "value": "1 спальня и 1 санузел " }] },
        { totalFloor: 2, area: 280, landArea: 500, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 3, amountShowers: null, amountBathrooms: 1, infrastructure: 'Вся инфраструктура рядом, до моря всего 40 метров.', rooms: TRooms.three, floors: [{ "floor": "Первый этаж", "value": "Холл, кухня-гостиная, 2 спальни, санузел" }, { "floor": "Второй этаж", "value": "Выход на террасу" }] },
        { totalFloor: 3, area: 450, landArea: 1000, livingArea: 220, bathroomArea: 18.5, kitchenArea: 35, amountBedrooms: 4, amountShowers: 1, amountBathrooms: 2, infrastructure: 'Море буквально в 5 минутах ходьбы. Рядом есть продовольственный магазин. На территории дома есть барбекю. Отличные соседи', rooms: TRooms.four },
        { totalFloor: 3, area: 321, landArea: 500, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 4, amountShowers: 1, amountBathrooms: 2, infrastructure: 'Развитая инфраструктура, рядом расположена остановка общественного транспорта, детская площадка и магазин. К дому ведет асфальтированная дорога.', rooms: TRooms.four, floors: [{ "floor": "Первый этаж", "value": "бойлерная (установлен газовый котел), сан узел, кухня-гостиная с выходом во двор, большой зал" }, { "floor": "Второй этаж", "value": "4 спальни (1 спальня с балконом), сан узел" }, { "floor": "Третий этаж", "value": "открытое пространство. По проекту задумывалась место отдыха с баром." }] },
        { totalFloor: 2, area: 190, landArea: 1800, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 3, amountShowers: 1, amountBathrooms: 1, infrastructure: null, rooms: TRooms.three, floors: null },
        { totalFloor: 1, area: 35, landArea: 800, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 1, amountShowers: null, amountBathrooms: 1, infrastructure: null, rooms: TRooms.one, floors: null },
        { totalFloor: 3, area: 80, landArea: 100, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 3, amountShowers: null, amountBathrooms: 1, infrastructure: 'До моря на автомобиле 3-5 минут, до центра Сочи 10 минут.', rooms: TRooms.three, floors: null },
        { totalFloor: 2, area: 250, landArea: 1400, livingArea: 150, bathroomArea: 15, kitchenArea: 20, amountBedrooms: 5, amountShowers: 1, amountBathrooms: 1, infrastructure: 'Море буквально в 5 минутах ходьбы. Рядом есть продовольственный магазин. На территории дома есть барбекю. Отличные соседи', rooms: TRooms.five },
        { totalFloor: 1, area: 52, landArea: 740, livingArea: 25, bathroomArea: 10, kitchenArea: 10, amountBedrooms: 3, amountShowers: 1, amountBathrooms: 1, infrastructure: 'Дом расположен в тихом спальном районе, до остановки общественного транспорта 10 минут пешим ходом, также до магазинов ,почты, до моря 10-20 минут пешим ходом', rooms: null },
        { totalFloor: 1, area: 47, landArea: 750, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 2, amountShowers: 1, amountBathrooms: 1, infrastructure: 'В пешей доступности Автовокзал, рынок, магазины, дет. сад.', rooms: TRooms.two, floors: null },
        { totalFloor: 1, area: 70, landArea: 800, livingArea: null, bathroomArea: null, kitchenArea: null, amountBedrooms: 2, amountShowers: 1, amountBathrooms: 1, infrastructure: 'Отличное место расположение дома в шаговой доступности супер маркет " ПУД", остановки школа 5, магазины. аптеки', rooms: TRooms.two, floors: null },
        { totalFloor: 2, area: 81, landArea: 600, livingArea: 59.5, bathroomArea: null, kitchenArea: 10, amountBedrooms: 5, amountShowers: 1, amountBathrooms: 1, infrastructure: null, rooms: TRooms.five, floors: null },
      ]
      const objectType = [
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        TObjectType.rent,
        TObjectType.rent,
        TObjectType.rent,
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        TObjectType.rent,
      ]
    
      for (let i = 0; i <= name.length - 1; i++) {
        let arrFavorite = []
        for (const c of customers) {
          if (faker.random.number({ 'min': 0, 'max': 2 }) === 0) {
            arrFavorite.push(c)
          }
        }
        await houseFactory.create({
          country: countries[0],
          region: regionsData[i],
          city: citiesData[i],
          name: name[i],
          description: description[i],
          address: address[i],
          longitude: longitude[i],
          latitude: latitude[i],
          price: price[i],
          owner: faker.random.arrayElement(customers),
          guides: generate_guides_for_object(availableGuidesHouse.filter(item => item.value !== 'Новостройка')),
          favorite: arrFavorite,
          status: faker.random.arrayElement(statuses),
          property: await housePropertyFactory.create(property[i]),
          files: [
            await fileFactory.create(),
            await fileFactory.create(),
          ],
          objectType: objectType[i],
          legalPurity: await legalPurityFactory.create({  
            recomendations: [{
              title: 'Дом в собственности менее 5 лет',
              description: 'При продаже продавец скорее всего должен будет заплатить налог с её продажи'
            }],
            encumbrances: [
              {
                title: 'На дом наложен арест',
                description: 'На дом наложен арест (описание)',
                status: true,
              },
              {
                title: 'Записей об аренде не найдено',
                description: null,
                status: false,
              }
            ]
          })
        });
      }
    }

    /* */

    
    /* land section */
    const landFactory = factory(LandEntity)();
    const landPropertyFactory = factory(LandPropertyEntity)();

    const availableGuidesLand = await connection
      .createQueryBuilder()
      .select('*')
      .from('guide', 'g')
      .where('\'land\' = any(g.for)')
      .getRawMany();

    for (const city of cities) {
      let region: RegionEntity;
      let name = [];
      let description: Array<string>;
      let address: Array<string>;
      let longitude: Array<number>;
      let latitude: Array<number>;
      let price: Array<number>;
      let property: Array<object>;
      let objectType: Array<TObjectType>;
      if (city.name === 'Ялта') {
        region = regions.filter(item => item.name === 'Крым')[0];
        name = [
          'Ялта Массандра Сосняк. Море 1 км!',
          '10.0 сот.',
          'Хорошие 4 сотки в городе Ялта',
          'Прекрасный видовой участок 2',
          'Участок, 2,6 га',
        ]
        description = [
          'Участок 10 соток, ИЖС, Ялта, Массандра, район Сосняк. Все документы в порядке. Не значительная растительность, не большой наклон, коммуникации по границе участка. Асфальтированный удобный подъезд, без серпантинов. Великолепный вид на море, горы, виноградники. Соседей рядом нет, ближайшие 150 метров. Спокойное элитное место для респектабельных людей. Собственник. Цена очень низкая, не найдете участок в Ялте по такой цене! Срочно нужны деньги, обстоятельства! Цена за сотку 600000 руб. Кадастровый номер участка 90:25:060301:872. Звоните, пишите  есть Viber, WhatsApp, Telegram!',
          'Продажа земельного участка в Алупке. До моря и пляжа 120 метров, до Воронцовского парка 350 метров по набережной. Площадь участка 10 соток, целевое назначение постройка и обслуживание жилого дома и сопутствующих сооружений. Участок имеет уклон в сторону моря, к участку удобный асфальтированный подъезд, вода на участке, свет и канализация проходят по границе участка, выполнена геология и геодезия, есть эскизный и конструктивный проект изящной виллы. При постройке двух и более этажей откроется панорамный вид на море. Соседние участки уже застроены солидными соседями, участок расположен по ул.Приморский переулок в 3 минутах пешком от пляжа Радуга, в 5 минутах пешком от пляжа Лазурный берег, в 8 минутах пешком от Воронцовского парка. Вся инфраструктура курорта и автовокзал в 5 минутах от участка.',
          'Продажа участка в Ялте. Район ТЦ" Конфетти" Очень удобное место для строительства дома или высокодоходного объекта недвижимости. Удаленность от трассы Севастополь - Ялта 300 м. К центральной Набережной Ялты 7 мин. на автомобиле.',
          'Участок для истинных ценителей красоты природы и комфорта. Вид с участка: Крымские горы, вершина Ай-Петри, море на 180 градусов .Вид не будет перекрыт  в будущем. Море и прекрасные пляжи в 300 м. Подъездные пути:асфальтная дорога. Соседи  :Частные виллы. Подробности по телефону',
          'Рад представить вам прекрасное место закрытое горами!вид на Ай-Петри,Бойко,Сатира В этом месте расположен дом из бруса только достроен ,размером 9*11 м . Дом на сваях . По дому разведены коммуникации ,свет в доме есть ,канализация тоже ,и септик . В ванной сделана стяжка под плитку и тёплый пол ,все коммуникации для унитаза ,ванной и тд проведены . Так же на участке расположен дом из сруба 3*5 м ,который может стать хорошей компактной баней . Так же есть и хоз блок 100кв метров.для всего необходимого . На участке есть вода ,которая течёт с горы Бойка ,необыкновенно вкусная !!! Заповедная зона ,в гости приходят и кабаны и олени и косули . Участок огорожен деревянным забором ,участок ровный,Земля чернозём . Такого места больше не где не найти !!! Вокруг горы и леса !прекрасное место для ЭКО туризма или реабилитационного центра ,на натуральной основе .!!! жду ваших звонков ,на все  доп.вопросы отвечу по телефону . Земля сельхоз ,реальному покупателю помогу перевести в рекреацию.',
        ]
        address = [
          'Симферопольское шоссе, 2А',
          'Приморский переулок, 2',
          'Большевистская улица, 8',
          'Алупкинское шоссе',
          'Зеленовское с/пос, Богатырь село, ул. Шевченко'
        ]
        longitude = [
          44.514990,
          44.415870,
          44.493274,
          44.428076,
          44.578890
        ]
        latitude = [
          34.208502,
          34.047048,
          34.129450,
          34.084103,
          34.007630
        ]
        price = [
          5500000,
          23000000,
          5200000,
          28000000,
          9000000,
        ],
        property = [
          { area: 1000, infrastructure: null },
          { area: 1000, infrastructure: null },
          { area: 400, infrastructure: null },
          { area: 2000, infrastructure: null },
          { area: 26000, infrastructure: null },
        ],
        objectType = [
          faker.random.arrayElement([TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
        ]
      }
      else if (city.name === 'Геленджик') {
        region = regions.filter(item => item.name === 'Краснодарский край')[0];
        name = [
          'Участок, 1,5 га',
          'Участок, 4 сот.',
          'Участок, 6 сот.',
          'Участок, 4,5 сот.',
          'Участок, 5 сот.',
        ]
        description = [
          'Собственность. Продаю 1 га земли.100 соток! Село Прасковеевка.Участок находится в горах! 1,5 км в гору.Поповская щель! Земля С/Х назначения, к землям ЛПХ не имеет никакого отношения!!! Статус участка  можно изменить на ИЖС!На законных основаниях! Поможем переоформить! Участок ровный!!!Ухоженный, не заросший. На участке растут  виноград,слива(сортовая),хурма. Участок ни разу не затапливался!После ливней,не размывает,вода не стоит. Электричество,газ,по границе. Вода:скважина. Родник с питьевой водой По границе участка,горная речка! Место, реально очень красивое! Кристально чистый воздух! Экологически чистое место! Рядом кедровый лес! На участке, есть небольшой дом,баня и хозпостройки! Помощь в продаже не НУЖНА! АГЕНТАМ,БЕЗ ПОКУПАТЕЛЕЙ НЕ БЕСПОКОИТЬ! Услуги не навязывать. РЕКЛАМА НЕ НУЖНА!!! (с.1 статьи 14.3 Кодекса РФ Не тратьте своё время! Спасибо за понимание! Быстрый выход на сделку! Всего в продаже 1,5 ГА земли. (150 соток) Цена обсуждается.',
          'Срочно продам участок в СНТ Урожай, с. Архипо-Осиповка, муниципальное образование Геленджик, 4 сотки. На участке 30 плодовых деревьев (персики, нектарины, слива, вишня). Сад ухоженный, участок ровный без подтоплений. Электричество и водопровод по границе участка. С 3-х сторон огорожен. Торг уместен.',
          'Продаю участок 6 соток в живописном месте СТ Вулан, рядом с Архипо-Осиповкой. Цена за весь участок!!!!! Участок находится на возвышенности, с потрясающим видом на горы. Свет по меже. Соседи живут круглый год. Подходит как под строительство собственного дома, так и под гостевой объект, оформление по дачной амнистии!! До трассы м4-дон 400 метров. До моря 6 км. Цены дорожают активно, прекрасное вложение средств. Для участка на море это крайне низкая цена, успейте приобрести до очередного подорожания!!! Небольшой торг уместен, звоните.',
          'Очень красивое, тихое место',
          'Продам в п.Виноградное, земельный участок площадью 5 соток( 32/18), ровный назначения КФК, для строительства загородных домов, коттеджей, можно использовать как дачу.Цена: 1 250 000 рублей.',
        ]
        address = [
          'Заречная улица',
          'садоводческое некоммерческое товарищество Урожай',
          'СТ Вулан',
          'садовое товарищество Бетта',
          'село Виноградное'
        ]
        longitude = [
          44.476978,
          44.432917,
          44.409083,
          44.388841,
          44.640377
        ]
        latitude = [
          38.221842,
          38.512627,
          38.517226,
          38.412941,
          38.003884
        ]
        price = [
          32000000,
          600000,
          1200000,
          5500000,
          1250000,
        ],
        property = [
          { area: 15000, infrastructure: 'На участке растут  виноград,слива(сортовая),хурма.' },
          { area: 400, infrastructure: 'На участке 30 плодовых деревьев (персики, нектарины, слива, вишня).' },
          { area: 600, infrastructure: null },
          { area: 450, infrastructure: null },
          { area: 500, infrastructure: null },
        ],
        objectType = [
          faker.random.arrayElement([TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.sale]),
        ]
      }
      else if (city.name === 'Севастополь') {
        region = regions.filter(item => item.name === 'Крым')[0];
        name = [
          'Продам участок 15 соток у моря',
          'Продам участок с Видом!',
          'Продам участок в живописном месте',
          'Продам живописный участок!',
          'Лучший участок в Севастополе!!!',
        ]
        description = [
          'Участок под ИЖС, подведены все коммуникации, развитая инфраструктура. Готов строительный проект гостиничного комплекса на этом участке.',
          'Продам свой живописный участок площадью 6 соток в экологически чистом месте -  село Черноречье, ул. Нагорная,27. В окружении лес, горы, река Чёрная. Участок ровный, с него открываются красивые виды на долину. В массив заведено электричество, возможность подключения 15 кВт., вода - скважина по согласованию, техническая вода от Водоканала, газ в селе в следующем году. Место уникальное, подходит для тех, кто ценит природу и свежий воздух. Транспорт ходит регулярно. 91:01:018001:130',
          'Продам свой живописный участок в экологически чистом месте с. Черноречье, ул. Межгорская,50. В окружении лес, горы, река Чёрная. Участок ровный, с него открываются красивые виды на долину. В массив заведено электричество, возможность подключения 15 кВт., вода - скважина по согласованию, техническая вода от Водоканала, газ в селе в следующем году. Место уникальное, подходит для тех, кто ценит природу и свежий воздух. Транспорт ходит регулярно. 91:01:018001:128',
          'Продам свой живописный участок в экологически чистом месте с. Черноречье, ул. Нагорная. В окружении лес, горы, река Чёрная. Участок ровный, с него открываются красивые виды на долину. В массив заведено электричество, возможность подключения 15 кВт., вода - скважина по согласованию, техническая вода от Водоканала, газ в селе в следующем году. Место уникальное, подходит для тех, кто ценит природу и свежий воздух. Транспорт ходит регулярно. 91:01:018001:177',
          'Продам свой собственный участок,  участок в городе Севастополь, СТ Балаклавец с прекрасным видом на город, рядом с сосновым лесом и чистейшим воздухом. Покупали для себя, в этом году планировали строить дом, но изменилось место службы. Участок ровный, прямоугольной формы 792 м2, 33/24м. 91:01:005014:267 Район с хорошей транспортной развязкой, быстро и без пробок можно добраться в любую точку города и Крыма, удобный и лёгкий выезд на "Тавриду" . Отличный подъезд по новой асфальтированной дороге. Тихое и спокойное место без городской суеты в самом экологически чистом месте города, остановка общественного транспорта и магазин в шаговой доступности: 3 минуты ходьбы. Вода городская, электричество 15кВ,возможность подключения газа.  Отличные соседи проживают круглогодично, просили найти им таких же хороших людей и плохим людям не продавать. Со второго этажа  будет открываться изумительный вид на весь город и бухты Севастополя. 20-25 минут пешком - и вы у моря, а если на машине, то за  5-10 минут. Реальному покупателю хороший торг. Документы РФ, готовы к сделке. Помощь Риэлторов не требуется.',
        ]
        address = [
          'Усадебная улица, 31',
          'Нагорная улица, 27',
          'Нагорная улица',
          'село Черноречье',
          'садоводческое товарищество Балаклавец, 31'
        ]
        longitude = [
          44.580154,
          44.539275,
          44.540348,
          44.543303,
          44.512020
        ]
        latitude = [
          33.447620,
          33.688916,
          33.688557,
          33.679726,
          33.527669
        ]
        price = [
          18000000,
          2100000,
          5000000,
          3200000,
          3800000,
        ],
        property = [
          { area: 1500, infrastructure: 'Развитая инфраструктура' },
          { area: 600, infrastructure: 'В окружении лес, горы, река Чёрная.' },
          { area: 1000, infrastructure: 'В окружении лес, горы, река Чёрная.' },
          { area: 770, infrastructure: 'Участок ровный, с него открываются красивые виды на долину. ' },
          { area: 79200, infrastructure: 'СТ Балаклавец с прекрасным видом на город, рядом с сосновым лесом и чистейшим воздухом. ' },
        ],
        objectType = [
          faker.random.arrayElement([TObjectType.sale]),
          faker.random.arrayElement([TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.buy, TObjectType.sale]),
          faker.random.arrayElement([TObjectType.sale]),
        ]
      }

      for (let i = 0; i <= name.length - 1; i++) {
        let arrFavorite = []
        for (const c of customers) {
          if (faker.random.number({ 'min': 0, 'max': 2 }) === 0) {
            arrFavorite.push(c)
          }
        }
        await landFactory.create({
          region: region,
          city: city,
          country: countries[0],
          name: name[i],
          description: description[i],
          address: address[i],
          longitude: longitude[i],
          latitude: latitude[i],
          price: price[i],
          owner: faker.random.arrayElement(customers),
          guides: generate_guides_for_object(availableGuidesLand.filter(item => item.value !== 'Новостройка')),
          favorite: arrFavorite,
          status: faker.random.arrayElement(statuses),
          property: await landPropertyFactory.create(property[i]),
          files: [
            await fileFactory.create(),
            await fileFactory.create(),
          ],
          objectType: objectType[i],
          legalPurity: await legalPurityFactory.create({  
            recomendations: [{
              title: 'Участок в собственности менее 5 лет',
              description: 'При продаже продавец скорее всего должен будет заплатить налог с её продажи'
            }],
            encumbrances: [
              {
                title: 'На участок наложен арест',
                description: 'На дом наложен арест (описание)',
                status: true,
              },
              {
                title: 'Записей об аренде не найдено',
                description: null,
                status: false,
              }
            ]
          })
        });
      }
    }
    /* */
  }


}
