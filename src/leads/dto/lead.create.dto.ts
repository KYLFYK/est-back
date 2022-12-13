import { ILeads } from '../interfaces/ILeads';
import { TLeadStatus } from '../types/TLeadStatus';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { EarlyPaymentCreateDto } from './early.payment.create.dto';
import { Type } from 'class-transformer';
import { IEarlyPayment } from '../interfaces/IEarlyPayment';

export class LeadCreateDto implements Omit<ILeads, 'id'|'createAt' >{

  @ApiProperty()
  email: string;

  @ApiProperty()
  fio: string;

  @ApiProperty()
  objectId: number;

  @ApiProperty()
  phone: string;

  @ApiProperty({type: 'enum', enum: TLeadStatus, example: TLeadStatus.new})
  status: TLeadStatus;

  @ApiProperty()
  statePrice: number;

  @ApiProperty()
  initialPayment: number;

  @ApiProperty()
  creditTerm: number;

  @ApiProperty()
  percentageRate: number;

  @IsArray()
  @Type(() => EarlyPaymentCreateDto)
  @ApiProperty({
    isArray: true,
    type: () => EarlyPaymentCreateDto,
    description: 'Досрочной погащение'
  })
  earlyPayment: IEarlyPayment[];

  // @ApiProperty()
  // dateOfPayment: Date;
  //
  // @ApiProperty()
  // frequencyPayment: number;
  //
  // @ApiProperty()
  // reduce: number;
  //
  // @ApiProperty()
  // frequencyPrice: number;

  @ApiProperty()
  monthlyPayment: number;

  @ApiProperty()
  creditTotal: number;

  @ApiProperty()
  percentTotal: number;

  @ApiProperty()
  monthlyIncome: number;
}
