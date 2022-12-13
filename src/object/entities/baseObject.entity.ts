import { Column, ManyToOne, JoinColumn, Index, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IBaseObject } from '../interfaces/baseObject.interface';

/* entities section*/
import { AccountEntity } from '../../account/entities/account.entity';
import { StatusEntity } from './status.entity';
import { RegionEntity } from '../../region/entities/region.entity';
import { ILegalPurity } from '../../leagal-purity/interfaces/ILegalPurity';
import { LegalPurityEntity } from '../../leagal-purity/entities/legalPurity.entity';
import { TRole } from '../../account/types/role';
import { TObjectType } from '../types/TObjectType';
import { CityEntity } from '../../city/entities/city.entity';
import { ICountry } from '../../country/interfaces/country.interface';
import { CountryEntity } from '../../country/entities/country.entity';
/* */

/* BaseObjectEntity - базовый класс. В БД нет этой сущности */
/* В implements исключаем guides, т.к. названия таблиц у каждого объекта уникально */
export class BaseObjectEntity extends BaseEntity implements Omit<IBaseObject, 'guides' | 'files' | 'favorite'> {

  @Column({ length: 200 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ length: 10, nullable: true })
  postcode: string;

  @Column({ nullable: true, type: 'float' })
  longitude: number;

  @Column({ nullable: true, type: 'float' })
  latitude: number;

  @Column({default: 0})
  @Index()
  views: number;

  @Column({ type: 'float', nullable: true })
  price: number;

  @ManyToOne(() => RegionEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'region', referencedColumnName: 'id' }])
  region: RegionEntity;

  @ManyToOne(() => CityEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'city', referencedColumnName: 'id' }])
  city: CityEntity;

  @ManyToOne(() => CountryEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'country', referencedColumnName: 'id' }])
  country: CountryEntity;

  @ManyToOne(() => AccountEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'owner', referencedColumnName: 'id' }])
  owner: AccountEntity;

  @ManyToOne(() => StatusEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'status', referencedColumnName: 'id' }])
  status: StatusEntity;

  @OneToOne(() => LegalPurityEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'legalPurity', referencedColumnName: 'id' }])
  legalPurity: ILegalPurity;

  @Column({ default: false })
  markAsDelete: boolean;

  @Column({
    type: 'enum',
    enum: TObjectType,
    default: TObjectType.sale
  })
  objectType: TObjectType
}
