import { IBaseIdInterface } from '../../../common/interfaces/base.interface';

export interface IAdmin extends IBaseIdInterface {
  lastLogin: Date;
}
