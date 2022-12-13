import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, Length } from 'class-validator';

export abstract class ConstructionProgressPostBodyDto {

  @ApiProperty({ default: '2022-01' })
  @IsDateString()
    date: Date;

  @ApiProperty()
  @IsString()
  @Length(1, 1000)
    description: string;

}