import { IBaseIdInterface } from '../../../common/interfaces/base.interface';
import { TRooms } from '../../types/rooms';

export interface IHouseProperty extends IBaseIdInterface {
  totalFloor: number; // кол-во этажей
  totalArea: number; // общая площадь
  area: number; // площадь дома
  livingArea: number; // жилая площадь
  landArea: number; // участок
  rooms: TRooms;
  bathroomArea: number; // площадь ванной
  kitchenArea: number; // площадь кухни
  amountBedrooms: number; // кол-во спален
  amountShowers: number; // кол-во душевых
  amountBathrooms: number; // кол-во санузлов
  floors: Array<object>; // описание этажей
  infrastructure: string;
  threeD: string; // 3D-тур
  vr: string; // vr-тур
  constructionFeatures: Array<object>; // особенности строительства
}
