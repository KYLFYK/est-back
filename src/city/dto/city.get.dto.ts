import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseIdDto } from '../../common/dto/base.dto';
import { ICity } from '../interfaces/city.interface';
import { IRegion } from '../../region/interfaces/region.interface';

export abstract class CityGetResponseDto  extends BaseIdDto implements ICity {

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  region: IRegion;
}
