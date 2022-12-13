import { Entity, Column } from 'typeorm';
import { IComplexProperty } from '../interfaces/complex/complexProperty.interface';

/* entities section */
import { BaseIdEntity } from '../../common/entities/base.entity';
/* */

@Entity('complex_property')
export class ComplexPropertyEntity extends BaseIdEntity implements IComplexProperty {
    
    @Column({ type: 'float', nullable: true })
    priceObjectMin: number;

    @Column({ type: 'float', nullable: true })
    priceObjectMax: number;

    @Column({ type: 'float', nullable: true })
    areaObjectMin: number;

    @Column({ type: 'float', nullable: true })
    areaObjectMax: number;

    @Column({ nullable: true, comment: 'Количество объектов (квартир и др) в ЖК' })
    amountObjects: number;

    @Column({ nullable: true })
    amountBuildings: number;

    @Column({ nullable: true })
    amountFloors: number;

    @Column({ type: 'float', nullable: true })
    heightCeilings: number;
    
    @Column({ nullable: true })
    infrastructure: string;
}
