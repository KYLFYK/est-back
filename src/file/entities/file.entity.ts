import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IFile } from '../interfaces/IFile';

@Entity('file')
export class FileEntity implements IFile {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  fileName: string;
  
  @Column()
  url: string;
  
  @Column()
  mimeType: string;

  @Column()
  size: string;

  @CreateDateColumn()
  readonly createAt: Date;

  @UpdateDateColumn()
  readonly updateAt: Date;

}
