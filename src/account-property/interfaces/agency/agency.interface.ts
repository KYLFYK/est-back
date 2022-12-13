import { IBaseIdInterface } from '../../../common/interfaces/base.interface';

export interface IAgency extends IBaseIdInterface {
  name: string;
  status: string;
  phone: object[];
  address: string;
  site: string;
  description: string;
}
