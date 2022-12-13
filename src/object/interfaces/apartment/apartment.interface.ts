import { IBaseObject } from '../baseObject.interface';
import { IComplex } from '../complex/complex.interface';
import { IApartmentProperty } from '../../../object-property/interfaces/apartment/apartmentProperty.interface';

export interface IApartment extends IBaseObject {
  property: IApartmentProperty;
  complex: IComplex;
}
