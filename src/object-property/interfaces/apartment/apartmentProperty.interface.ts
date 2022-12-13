import { IBaseIdInterface } from '../../../common/interfaces/base.interface';
import { TRooms } from '../../types/rooms';

export interface IApartmentProperty extends IBaseIdInterface {
  floor: number; // этаж
  totalFloor: number; // кол-во этажей
  area: number; // площадь
  livingArea: number; // жилая площадь
  bathroomArea: number; // площадь ванной
  kitchenArea: number; // площадь кухни
  roomsArea: Array<number>; // площадь комнат
  amountBedrooms: number; // кол-во спален
  amountShowers: number; // кол-во душевых
  amountBathrooms: number; // кол-во санузлов
  buildingNumber: number; // номер корпуса
  heightCeilings: number; // высота потолков
  deadline: Date; // срок сдачи
  interior: string; // интерьер
  infrastructure: string;
  rooms: TRooms;
  threeD: string; // 3D-тур
  vr: string; // vr-тур
  constructionFeatures: Array<object>; // особенности строительства
}
