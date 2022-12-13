import { ApiProperty } from '@nestjs/swagger';
import { BaseIdDto } from '../../common/dto/base.dto';
import { ICountry } from '../interfaces/country.interface';

export abstract class CountryGetResponseDto  extends BaseIdDto implements ICountry {

  @ApiProperty()
  name: string;
}