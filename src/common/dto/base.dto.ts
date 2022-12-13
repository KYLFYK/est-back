import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';
import { IBaseInterface, IBaseIdInterface } from '../interfaces/base.interface';

export class BaseDto implements IBaseInterface {
  @IsNumber()
  @ApiProperty()
  readonly id: number;

  @IsDateString()
  @ApiProperty()
  readonly createAt: Date;

  @IsDateString()
  @ApiProperty()
  readonly updateAt: Date;
}

export class BaseIdDto implements IBaseIdInterface {
  @IsNumber()
  @ApiProperty()
  readonly id: number;
}