import { Entity, ManyToMany, JoinTable, JoinColumn, Column, OneToOne } from 'typeorm';
import { ILand } from '../interfaces/land/land.interface';
import { LandPropertyEntity } from '../../object-property/entities/landProperty.entity';
import { BaseObjectEntity } from './baseObject.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';
import { AccountEntity } from '../../account/entities/account.entity';
import { IAccount } from '../../account/interfaces/account.interface';
import { TObjectType } from '../types/TObjectType';

@Entity('land')
export class LandEntity extends BaseObjectEntity implements ILand {

  @OneToOne(() => LandPropertyEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'property', referencedColumnName: 'id' }])
  property: LandPropertyEntity;

  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'land_file' })
  files: IFile[];

  @ManyToMany(() => GuideEntity)
  @JoinTable({
    name: 'land_guide',
  })
  guides: GuideEntity[];

  @ManyToMany(() => AccountEntity)
  @JoinTable({
    name: 'land_favorite',
  })
  favorite: IAccount[];

  @Column({
    type: 'enum',
    enum: TObjectType,
    default: TObjectType.sale
  })
  objectType: TObjectType
}
