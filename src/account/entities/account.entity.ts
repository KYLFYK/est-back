import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IAccount } from '../interfaces/account.interface';
import { TRole } from '../types/role';
import { IsEmail } from 'class-validator';

/* entities section*/
import { BaseEntity } from '../../common/entities/base.entity';
import { CustomerEntity } from '../../account-property/entities/customer.entity';
import { DeveloperEntity } from '../../account-property/entities/developer.entity';
import { AgencyEntity } from '../../account-property/entities/agency.entity';
import { AgentEntity } from '../../account-property/entities/agent.entity';
import { AdminEntity } from '../../account-property/entities/admin.entity';
import { BankEntity } from '../../account-property/entities/bank.entity';
/* */

@Entity('account')
export class AccountEntity extends BaseEntity implements IAccount {

  @Column({
    unique: true,
  })
  @IsEmail()
    email: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column({
    default: false,
  })
    markAsDelete: boolean;

  @Column({
    default: false,
  })
    isConfirmed: boolean;

  @Column({
    type: 'enum',
    enum: TRole,
    default: TRole.customer,
  })
    role: TRole;

  @OneToOne(() => CustomerEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'customerProperty', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    customerProperty: CustomerEntity;

  @OneToOne(() => DeveloperEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'developerProperty', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    developerProperty: DeveloperEntity;

  @OneToOne(() => AgencyEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'agencyProperty', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    agencyProperty: AgencyEntity;

  @OneToOne(() => AgentEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'agentProperty', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    agentProperty: AgentEntity;

  @OneToOne(() => AdminEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'adminProperty', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    adminProperty: AdminEntity;

  @OneToOne(() => BankEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'bankProperty', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    bankProperty: BankEntity;    
}
