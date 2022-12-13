import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { ICustomer } from '../interfaces/customer/customer.interface';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';

@Entity('customer')
export class CustomerEntity extends BaseIdEntity implements ICustomer {

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  phone: object[];

  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'customer_file' })
  file: IFile[];
}
