import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsEnum, IsNotEmpty, ArrayUnique, IsOptional } from 'class-validator';
import { IGuide } from '../interfaces/guide.interface';

/* types section */
import { TType_en, TType_ru } from '../types/type';
import { TFor } from '../types/for';
import { TSubtitle_en, TSubtitle_ru } from '../types/subtitle';
/* */

export class GuidePutBodyDto implements Omit<IGuide, 'id'> {

  @ApiPropertyOptional({
    type: 'enum',
    enum: TSubtitle_en,
  })
  // @IsEnum(TSubtitle_en)
  subtitle_en: TSubtitle_en;

  @ApiPropertyOptional({
    type: 'enum',
    enum: TSubtitle_ru,
  })
  // @IsEnum(TSubtitle_ru)
  subtitle_ru: TSubtitle_ru;

  @ApiProperty({
    type: 'enum',
    enum: TType_en,
  })
  @IsNotEmpty()
  @IsEnum(TType_en)
  type_en: TType_en;

  @ApiProperty({
    type: 'enum',
    enum: TType_ru,
  })
  @IsNotEmpty()
  @IsEnum(TType_ru)
  type_ru: TType_ru;

  @ApiProperty()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty()
  for: TFor[];

  @ApiPropertyOptional({
    type: 'boolean',
    default: false
  })
  @IsOptional()
  isMulti: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class GuidePutResponseDto implements IGuide {
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
