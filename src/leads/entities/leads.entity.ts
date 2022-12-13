import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { ILeads } from '../interfaces/ILeads';
import { TLeadStatus } from '../types/TLeadStatus';
import { EarlyPaymentEntity } from './early.payment.entity';

@Entity('leads')
export class LeadsEntity extends BaseIdEntity implements ILeads {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date;

  @Column()
  email: string;

  @Column()
  fio: string;

  @Column()
  objectId: number;

  @Column()
  phone: string;

  @Column({type: 'enum', enum: TLeadStatus, default: TLeadStatus.new})
  status: TLeadStatus;

  @Column()
  statePrice: number;

  @Column()
  initialPayment: number;

  @Column()
  creditTerm: number;

  @Column()
  percentageRate: number;

  @OneToMany(() => EarlyPaymentEntity, payment => payment.lead)
  earlyPayment: EarlyPaymentEntity[]

  // @Column()
  // dateOfPayment: Date;
  //
  // @Column()
  // frequencyPayment: number;
  //
  // @Column()
  // reduce: number;
  //
  // @Column()
  // frequencyPrice: number;

  @Column()
  monthlyPayment: number;

  @Column()
  creditTotal: number;

  @Column()
  percentTotal: number;

  @Column()
  monthlyIncome: number;
}
