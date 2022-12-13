import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IComplex } from '../interfaces/complex/complex.interface';

/* entities section*/
import { ComplexPropertyEntity } from '../../object-property/entities/complexProperty.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { StatusEntity } from './status.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { RegionEntity } from '../../region/entities/region.entity';
import { IConstructionProgress } from '../../construction-progress/interfaces/construction-progress.interface';
import { ConstructionProgressEntity } from '../../construction-progress/entities/construction-progress.entity';
import { IAccount } from '../../account/interfaces/account.interface';
import { TObjectType } from '../types/TObjectType';
import { CityEntity } from '../../city/entities/city.entity';
import { CountryEntity } from '../../country/entities/country.entity';
/* */

@Entity('complex')
export class ComplexEntity extends BaseEntity implements IComplex {

  @ManyToOne(() => CountryEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'country', referencedColumnName: 'id' }])
  country: CountryEntity;

  @OneToOne(() => ComplexPropertyEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'property', referencedColumnName: 'id' }])
  property: ComplexPropertyEntity;

  @ManyToMany(() => GuideEntity)
  @JoinTable({
    name: 'complex_guide',
  })
  guides: GuideEntity[];

  @ManyToMany(() => AccountEntity)
  @JoinTable({
    name: 'complex_favorite',
  })
  favorite: IAccount[];

  @ManyToMany(() => ConstructionProgressEntity)
  @JoinTable({
    name: 'complex_construction_progress',
  })
  constructionProgress: ConstructionProgressEntity[];

  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'complex_file' })
  files: IFile[];

  @OneToOne(() => FileEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'readiness', referencedColumnName: 'id' }])
  readiness: IFile;

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
  views: number;

  @ManyToOne(() => RegionEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'region', referencedColumnName: 'id' }])
  region: RegionEntity;

  @ManyToOne(() => CityEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'city', referencedColumnName: 'id' }])
  city: CityEntity;

  @ManyToOne(() => AccountEntity, { onDelete: 'SET NULL' })
  @JoinColumn()
  owner: AccountEntity;

  @ManyToOne(() => StatusEntity, { onDelete: 'SET NULL' })
  @JoinColumn()
  status: StatusEntity;

  @Column({ default: false })
  markAsDelete: boolean;

  @Column({
    type: 'enum',
    enum: TObjectType,
    default: TObjectType.sale
  })
  objectType: TObjectType
}
