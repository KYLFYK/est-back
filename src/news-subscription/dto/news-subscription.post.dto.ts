import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export abstract class NewsSubscriptionPostBodyDto {

  @ApiProperty()
  @IsString()
  @Length(1, 50)
    name: string;
  
  @ApiProperty()
  @IsString()
  @Length(1, 30)
    phone: string;

  @ApiProperty({ default: 'ivan@mail.ru' })
  @IsString()
  @Length(1, 50)
    email: string;
}

