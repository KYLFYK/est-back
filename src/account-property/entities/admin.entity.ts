import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { IAdmin } from '../interfaces/admin/admin.interface';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';

@Entity('admin')
export class AdminEntity extends BaseIdEntity implements IAdmin {
  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'admin_file' })
    file: IFile[];

  @Column({ nullable: true })
    lastLogin: Date;
}
