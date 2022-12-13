import { Entity, Column, ManyToMany, JoinTable, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IHouse } from '../interfaces/house/house.interface';

/* entities section */
import { HousePropertyEntity } from '../../object-property/entities/houseProperty.entity';
import { BaseObjectEntity } from './baseObject.entity';
import { ComplexEntity } from './complex.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';
import { IAccount } from '../../account/interfaces/account.interface';
import { AccountEntity } from '../../account/entities/account.entity';
import { TObjectType } from '../types/TObjectType';
/* */

@Entity('house')
export class HouseEntity extends BaseObjectEntity implements IHouse {

  @OneToOne(() => HousePropertyEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'property', referencedColumnName: 'id' }])
  property: HousePropertyEntity;

  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'house_file' })
  files: IFile[];

  @ManyToMany(() => GuideEntity)
  @JoinTable({
    name: 'house_guide',
  })
  guides: GuideEntity[];

  @ManyToMany(() => AccountEntity)
  @JoinTable({
    name: 'house_favorite',
  })
  favorite: IAccount[];

  @ManyToOne(() => ComplexEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'complex', referencedColumnName: 'id' }])
  @Column({ nullable: true })
  complex: ComplexEntity;

  @Column({
    type: 'enum',
    enum: TObjectType,
    default: TObjectType.sale
  })
  objectType: TObjectType

}
