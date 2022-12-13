import { IBaseIdInterface } from '../../../common/interfaces/base.interface';

export interface IComplexProperty extends IBaseIdInterface {
    priceObjectMin: number;
    priceObjectMax: number;
    areaObjectMin: number;
    areaObjectMax: number;
    amountObjects: number;
    amountBuildings: number;
    amountFloors: number;
    heightCeilings: number;
    infrastructure: string;
}
