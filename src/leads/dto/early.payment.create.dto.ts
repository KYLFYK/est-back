import { IEarlyPayment } from '../interfaces/IEarlyPayment';
import { ApiProperty } from '@nestjs/swagger';

export class EarlyPaymentCreateDto implements IEarlyPayment{
  @ApiProperty()
  dateOfPayment: Date;

  @ApiProperty()
  frequencyPayment: string;

  @ApiProperty()
  frequencyPrice: number;

  @ApiProperty()
  reduce: string;
}
