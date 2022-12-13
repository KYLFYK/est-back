import { IBaseIdInterface } from '../../common/interfaces/base.interface';

export interface IPress extends IBaseIdInterface {
  date: Date;
  title: string;
  text: string;
  link: string;
  logo: string;
}
