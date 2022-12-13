import { Entity } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { IBank } from '../interfaces/bank/bank.interface';

@Entity('bank')
export class BankEntity extends BaseIdEntity implements IBank {}
