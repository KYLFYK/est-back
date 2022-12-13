import { IHouseProperty } from 'src/object-property/interfaces/house/houseProperty.interface';
import { IBaseObject } from '../baseObject.interface';
import { IComplex } from '../complex/complex.interface';

export interface IHouse extends IBaseObject {
  property: IHouseProperty;
  complex?: IComplex;
}
