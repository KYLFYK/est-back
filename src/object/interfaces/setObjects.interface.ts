import { IBaseIdInterface } from '../../common/interfaces/base.interface';
import { IGuide } from '../../guide/interfaces/guide.interface';

export interface ISetObjects extends IBaseIdInterface {
  objectType: IGuide;
  objectId: number;
}
