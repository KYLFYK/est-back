import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseIdDto } from '../../common/dto/base.dto';
import { ICity } from '../interfaces/city.interface';
import { IRegion } from '../../region/interfaces/region.interface';
import { IsNumber, IsString } from 'class-validator';

export abstract class CityCreateDto implements Omit<ICity, 'id'> {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  regionId: number;
}
