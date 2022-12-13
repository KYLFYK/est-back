import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, Length } from 'class-validator';

export abstract class ConstructionProgressPutBodyDto {

  @ApiProperty()
  @IsDateString()
  @IsOptional()
    date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 1000)
    description: string;

}