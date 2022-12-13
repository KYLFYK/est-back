import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { INewsSubscription } from '../interfaces/news-subscription.interface';

/* entities section */
import { BaseIdEntity } from '../../common/entities/base.entity';
import { SetObjectsEntity } from 'src/object/entities/setObjects.entity';
/* */

@Entity('news_subscription')
export class NewsSubscriptionEntity extends BaseIdEntity implements INewsSubscription {

  @Column({ length: 50 })
  name: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ length: 50 })
  email: string;
}
