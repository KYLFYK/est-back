import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsMilitaryTime, IsEnum } from 'class-validator';

import { BaseDto } from '../../common/dto/base.dto';

/* interfaces section */
import { IGuide } from '../../guide/interfaces/guide.interface';
import { TObjectType } from '../../object/types/TObjectType';
/* */

export class ViewApplicationGetResponseDto extends BaseDto {

  @ApiProperty()
  @IsString()
    name: string;

  @ApiProperty()
  @IsString()
    phone: string;

  @ApiProperty({ default: 'ivan@mail.ru' })
  @IsString()
    email: string;

  @ApiProperty()
  @IsString()
  agentName: string;

  @ApiProperty({ type: 'enum', enum: TObjectType})
  @IsEnum(TObjectType)
  orderType: TObjectType;

  @ApiProperty({ default: '12:00' })
  @IsMilitaryTime()
    comfortableTimeFrom: Date;

  @ApiProperty({ default: '18:00' })
  @IsMilitaryTime()
    comfortableTimeTo: Date;

  @ApiProperty()
    status: IGuide;

}

export class ViewApplicationPostResponseDto {
  @ApiProperty()
  @IsNumber()
    id: number;
}
