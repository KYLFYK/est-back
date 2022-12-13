import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ObjectResponseDto } from '../object.response.dto';

export class LandResponseDto extends ObjectResponseDto  {

  @ApiProperty()
  @IsNumber()
    price: number;
}
