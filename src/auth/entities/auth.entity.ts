import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IAuth } from '../interfaces/auth.interface';
import { AccountEntity } from '../../account/entities/account.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('auth')
export class AuthEntity extends BaseEntity implements IAuth {
  @Column()
    publicKey: string;

  @Column()
    privateKey: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn([
    {
      name: 'account', referencedColumnName: 'id',
    },
  ])
    account: AccountEntity;

}
