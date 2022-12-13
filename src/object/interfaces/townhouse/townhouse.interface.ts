import { ITownhouseProperty } from '../../../object-property/interfaces/townhouse/townhouseProperty.interface';
import { IBaseObject } from '../baseObject.interface';
import { IComplex } from '../complex/complex.interface';

export interface ITownhouse extends IBaseObject {
  property: ITownhouseProperty;
  complex?: IComplex;
}
