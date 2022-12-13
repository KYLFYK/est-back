import { IEarlyPayment } from '../interfaces/IEarlyPayment';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LeadsEntity } from './leads.entity';


@Entity('early_payment')
export class EarlyPaymentEntity implements IEarlyPayment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  dateOfPayment: Date;

  @Column()
  frequencyPayment: string;

  @Column()
  frequencyPrice: number;

  @Column()
  reduce: string;

  @ManyToOne(() => LeadsEntity,
    lead => lead.earlyPayment)
  @JoinColumn()
  lead: LeadsEntity;
}
