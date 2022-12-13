import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { ObjectResponseDto } from '../object.response.dto';
import { IComplex } from '../../interfaces/complex/complex.interface';

export class HouseResponseDto extends ObjectResponseDto {

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  complex: IComplex;
}
