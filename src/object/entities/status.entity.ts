import { Column, Entity } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { IStatus } from '../interfaces/status/status.interface';

@Entity('status')
export class StatusEntity extends BaseIdEntity implements IStatus {

  @Column({ length: 50 })
    status: string;
}
