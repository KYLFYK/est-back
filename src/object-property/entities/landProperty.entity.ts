import { Entity, Column } from 'typeorm';
import { ILandProperty } from '../interfaces/land/landProperty.interface';

/* entities section */
import { BaseIdEntity } from '../../common/entities/base.entity';
import { LandEntity } from '../../object/entities/land.entity';
/* */

@Entity('land_property')
export class LandPropertyEntity extends BaseIdEntity implements ILandProperty {

  @Column({ type: 'float', nullable: true })
  area: number;
  
  @Column({ nullable: true })
  infrastructure: string;
}
