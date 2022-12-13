import { IBaseIdInterface } from "../../common/interfaces/base.interface";
import { IRegion } from '../../region/interfaces/region.interface';

export interface ICity extends IBaseIdInterface {
  name: string;
  region?: IRegion;
}
