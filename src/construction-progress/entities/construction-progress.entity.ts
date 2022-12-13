import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { IConstructionProgress } from '../interfaces/construction-progress.interface';
import { BaseIdEntity } from '../../common/entities/base.entity';

import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';


@Entity('construction_progress')
export class ConstructionProgressEntity extends BaseIdEntity implements IConstructionProgress {
    
  @Column()
  date: Date;
  
  @Column({length: 1000})
  description: string;

  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'construction_progress_file' })
  file: IFile[];    
}
