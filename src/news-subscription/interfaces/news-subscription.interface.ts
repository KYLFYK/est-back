import { IBaseIdInterface } from '../../common/interfaces/base.interface';

export interface INewsSubscription extends IBaseIdInterface {
  name: string;
  email: string;
  phone: string;
}
