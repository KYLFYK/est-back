import { Entity, Column, ManyToMany, JoinTable, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ITownhouse } from '../interfaces/townhouse/townhouse.interface';

import { TownhousePropertyEntity } from '../../object-property/entities/townhouseProperty.entity';
import { BaseObjectEntity } from './baseObject.entity';
import { ComplexEntity } from './complex.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';
import { AccountEntity } from '../../account/entities/account.entity';
import { IAccount } from '../../account/interfaces/account.interface';
import { TObjectType } from '../types/TObjectType';

@Entity('townhouse')
export class TownhouseEntity extends BaseObjectEntity implements ITownhouse {

  @OneToOne(() => TownhousePropertyEntity, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'object', referencedColumnName: 'id' }])
  property: TownhousePropertyEntity;

  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'townhouse_file' })
  files: IFile[];

  @ManyToMany(() => GuideEntity)
  @JoinTable({
    name: 'townhouse_guide',
  })
  guides: GuideEntity[];

  @ManyToOne(() => ComplexEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'complex', referencedColumnName: 'id' }])
  complex: ComplexEntity;

  @ManyToMany(() => AccountEntity)
  @JoinTable({
    name: 'townhouse_favorite',
  })
  favorite: IAccount[];

  @Column({
    type: 'enum',
    enum: TObjectType,
    default: TObjectType.sale
  })
  objectType: TObjectType
}
