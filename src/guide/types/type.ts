export enum TType_ru {
  lang = 'Язык',
  class = 'Класс жилья',
  decorating = 'Отделка',
  parking = 'Парковка',
  safety = 'Безопасность',

  construction = 'Тип дома',
  groundwork = 'Фундамент',
  roof = 'Кровля',
  wall = 'Стены',

  water = 'Водопровод',
  heating = 'Отопление',
  sewerage = 'Канализация',
  electricity = 'Электричество',
  internet = 'Интернет',

  window = 'Вид из окон',
  furniture = 'Мебель',
  buildings = 'Объекты на территории',

  bathroom = 'Санузел'
}

export enum TType_en {
  lang = 'lang',
  objectType = 'objectType', // тип недвижимости: house, apartment
  buildingType = 'buildingType', // тип строения: новостройка, вторичка

  /* основные свойства объектов */
  class = 'class', //класс жилья: бизнес
  decorating = 'decorating', // отделка: черновая
  parking = 'parking', // парковка: Подземеный паркинг, Автостоянка
  window = 'window', // вид из окна
  safety = 'safety', // безопасность
  buildings = 'buildings', // строения: забор, детская площадка, места для отдыха
  bathroom = 'bathroom', // санузел
  /* */

  /* Стротельно-техническая */
  construction = 'construction',
  groundwork = 'groundwork',
  roof = 'roof',
  wall = 'wall',
  /* */

  /* Инженерные коммуникации */
  water = 'water',
  heating = 'heating',
  sewerage = 'sewerage',
  electricity = 'electricity',
  internet = 'internet',
  /* */

  furniture = 'furniture',

  /* Заявка на просмотр */
  viewApplicationStatus = 'viewApplicationStatus', // статус: просмотрено, завершено
  /* */
}
