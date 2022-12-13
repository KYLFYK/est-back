import { ApiProperty } from '@nestjs/swagger';

import { BaseIdDto } from '../../common/dto/base.dto';
import { IRegion } from '../interfaces/region.interface';

export abstract class RegionGetResponseDto  extends BaseIdDto implements IRegion {

  @ApiProperty()
    name: string;
}