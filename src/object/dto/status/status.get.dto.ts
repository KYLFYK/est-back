import { ApiProperty } from '@nestjs/swagger';
import { BaseIdDto } from '../../../common/dto/base.dto';
import { IStatus } from '../../../object/interfaces/status/status.interface';


export abstract class StatusGetResponseDto extends BaseIdDto implements IStatus {

  @ApiProperty()
  status: string;
}