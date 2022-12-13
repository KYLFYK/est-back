import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { BaseDto } from '../../../common/dto/base.dto';
import { ObjectResponseDto } from '../object.response.dto';
import { IApartment } from '../../interfaces/apartment/apartment.interface';
import { IComplex } from '../../interfaces/complex/complex.interface';
import { IGuide } from '../../../guide/interfaces/guide.interface';

export class ApartmentResponseDto extends ObjectResponseDto  {

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  complex: IComplex;
}
