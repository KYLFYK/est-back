import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { ICity } from '../interfaces/city.interface';
import { RegionEntity } from '../../region/entities/region.entity';

@Entity('city')
export class CityEntity extends BaseIdEntity implements ICity {
  @Column({ length: 70 })
  name: string;

  @ManyToOne(() => RegionEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'region', referencedColumnName: 'id' }])
  region: RegionEntity;
}
