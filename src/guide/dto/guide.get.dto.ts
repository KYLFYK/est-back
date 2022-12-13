import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray } from 'class-validator';
import { IGuide } from '../interfaces/guide.interface';

/* types section */
import { TType_en, TType_ru } from '../types/type';
import { TFor } from '../types/for';
import { TSubtitle_en, TSubtitle_ru } from '../types/subtitle';
/* */

export class GuideGetResponseDto implements IGuide {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  subtitle_en: TSubtitle_en;

  @ApiProperty()
  @IsString()
  subtitle_ru: TSubtitle_ru;

  @ApiProperty()
  @IsString()
  type_en: TType_en;

  @ApiProperty()
  @IsString()
  type_ru: TType_ru;

  @ApiProperty()
  @IsArray()
  for: TFor[];

  @ApiProperty()
  @IsString()
  value: string;
}
