import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Length, IsMilitaryTime, IsEnum } from 'class-validator';
import { TObjectType } from '../../object/types/TObjectType';

export class ViewApplicationPostBodyDto {

  @ApiProperty()
  @IsString()
  @Length(1, 50)
    name: string;

  @ApiProperty()
  @IsString()
  @Length(1, 30)
    phone: string;

  @ApiProperty({ default: 'ivan@mail.ru' })
  @IsString()
  @Length(1, 50)
    email: string;

  @ApiPropertyOptional()
  @IsOptional()
  agentName?: string;

  @ApiProperty({ type: 'enum', enum: TObjectType})
  @IsEnum(TObjectType)
  orderType: TObjectType;

  @ApiProperty({ default: '12:00' })
  @IsOptional()
  @IsMilitaryTime()
    comfortableTimeFrom: Date;

  @ApiProperty({ default: '18:00' })
  @IsOptional()
  @IsMilitaryTime()
    comfortableTimeTo: Date;

  @ApiProperty({ default: 'Новая заявка' })
  @IsString()
  @IsOptional()
    status: string;
}

export class ViewApplicationPostResponseDto {
  @ApiProperty()
  @IsNumber()
    id: number;
}
