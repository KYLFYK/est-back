import { IBaseIdInterface } from '../../../common/interfaces/base.interface';

export interface ICustomer extends IBaseIdInterface {
  name: string;
  phone: object[];
}
