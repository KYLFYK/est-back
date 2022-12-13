import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { ISetObjects } from '../interfaces/setObjects.interface';

/* entities section */
import { BaseIdEntity } from '../../common/entities/base.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
/* */

@Entity('set_objects')
export class SetObjectsEntity extends BaseIdEntity implements ISetObjects {

  @ManyToOne(() => GuideEntity, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'objectType', referencedColumnName: 'id' }])
  @Column()
    objectType: GuideEntity;

  @Column()
    objectId: number;
}
