import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { IAgency } from '../interfaces/agency/agency.interface';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';

@Entity('agency')
export class AgencyEntity extends BaseIdEntity implements IAgency {
  @ManyToMany(() => FileEntity, {
    cascade: true
  })

  @JoinTable({ name: 'agency_file' })
    file: IFile[];

  @Column({ length: 50, nullable: true })
    name: string;

  @Column({ length: 30, nullable: true })
    status: string;

  @Column({ type: 'jsonb', nullable: true })
  phone: object[];

  @Column({ length: 200, nullable: true })
    address: string;

  @Column({ length: 200, nullable: true })
    site: string;

  @Column({ nullable: true })
    description: string;
}
