import { ILandProperty } from 'src/object-property/interfaces/land/landProperty.interface';
import { IBaseObject } from '../baseObject.interface';

export interface ILand extends IBaseObject {
    property: ILandProperty;
}
