import { ApiProperty } from '@nestjs/swagger';

import { IRegion } from '../interfaces/region.interface';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export abstract class RegionCreateDto implements Omit<IRegion, 'id'> {

  @ApiProperty({ description: 'Название региона'})
  @IsString()
  name: string;
}
