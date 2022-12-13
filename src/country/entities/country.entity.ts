import { Entity, Column } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { ICountry } from '../interfaces/country.interface';

@Entity('country')
export class CountryEntity extends BaseIdEntity implements ICountry {
  @Column({ length: 70 })
  name: string;
}