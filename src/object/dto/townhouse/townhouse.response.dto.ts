import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

/* dto section */
import { BaseDto } from '../../../common/dto/base.dto';
import { ObjectResponseDto } from '../object.response.dto';
/* */

/* interfaces section */
import { ITownhouse } from '../../interfaces/townhouse/townhouse.interface';
import { IComplex } from '../../interfaces/complex/complex.interface';
import { IGuide } from '../../../guide/interfaces/guide.interface';
/* */

export class TownhouseResponseDto extends ObjectResponseDto  {

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  complex: IComplex;

}
