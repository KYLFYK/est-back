import { Entity, Column } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { IRegion } from '../interfaces/region.interface';

@Entity('region')
export class RegionEntity extends BaseIdEntity implements IRegion {
  @Column({ length: 70 })
    name: string;
}