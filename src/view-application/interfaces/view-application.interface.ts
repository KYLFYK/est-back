/* interfaces section  */
import { IBaseInterface } from '../../common/interfaces/base.interface';
import { IGuide } from '../../guide/interfaces/guide.interface';
import { ISetObjects } from '../../object/interfaces/setObjects.interface';
import { TObjectType } from '../../object/types/TObjectType';
/* */

export interface IViewApplication extends IBaseInterface {
  name: string;
  email: string;
  phone: string;
  agentName: string;
  orderType: TObjectType;
  comfortableTimeFrom: Date;
  comfortableTimeTo: Date;
  object: ISetObjects;
  status: IGuide;
  markAsDelete: boolean;
}
