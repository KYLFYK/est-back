import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';

import { BaseIdDto } from '../../common/dto/base.dto';

export abstract class ConstructionProgressGetResponseDto extends BaseIdDto {
  
  @ApiProperty()
  @IsDate()
    date: Date;

  @ApiProperty()
  @IsString()
    description: string;
}