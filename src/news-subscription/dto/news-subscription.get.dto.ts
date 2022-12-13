import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { BaseIdDto } from '../../common/dto/base.dto';

export abstract class NewsSubscriptionGetResponseDto extends BaseIdDto {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ default: 'ivan@mail.ru' })
  @IsString()
  email: string;
}

export abstract class NewsSubscriptionGetResponseByObjectDto extends BaseIdDto {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ default: 'ivan@mail.ru' })
  @IsString()
  email: string;
}
