import { Entity, Column, ManyToMany, JoinTable, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IApartment } from '../interfaces/apartment/apartment.interface';

import { ApartmentPropertyEntity } from '../../object-property/entities/apartmentProperty.entity';
import { BaseObjectEntity } from './baseObject.entity';
import { ComplexEntity } from './complex.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';
import { IAccount } from '../../account/interfaces/account.interface';
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('apartment')
export class ApartmentEntity extends BaseObjectEntity implements IApartment {

  @OneToOne(() => ApartmentPropertyEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'property', referencedColumnName: 'id' }])
  property: ApartmentPropertyEntity;

  @ManyToMany(() => GuideEntity)
  @JoinTable({ name: 'apartment_guide' })
  guides: GuideEntity[];

  @ManyToMany(() => AccountEntity)
  @JoinTable({ name: 'apartment_favorite' })
  favorite: IAccount[];

  @ManyToOne(() => ComplexEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'complex', referencedColumnName: 'id' }])
  @Column({ nullable: true })
  complex: ComplexEntity;

  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'apartment_file' })
  files: IFile[];
}
