import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { IViewApplication } from '../interfaces/view-application.interface';

/* entities section */
import { BaseEntity } from '../../common/entities/base.entity';
import { SetObjectsEntity } from '../../object/entities/setObjects.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { TObjectType } from '../../object/types/TObjectType';
/* */

@Entity('view_application')
export class ViewApplicationEntity extends BaseEntity implements IViewApplication {

  @Column({ length: 50 })
    name: string;

  @Column({ length: 30 })
    phone: string;

  @Column({ length: 50 })
    email: string;

  @Column({ nullable: true })
  agentName: string;

  @Column({ type: 'enum', enum: TObjectType, default: TObjectType.sale})
  orderType: TObjectType;

  @Column('time', { nullable: true })
    comfortableTimeFrom: Date;

  @Column('time', { nullable: true })
    comfortableTimeTo: Date;

  @ManyToOne(() => SetObjectsEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'object', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    object: SetObjectsEntity;

  @ManyToOne(() => GuideEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'status', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    status: GuideEntity;

  @Column({ default: false })
    markAsDelete: boolean;
}
