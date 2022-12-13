import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional } from 'class-validator';

export abstract class NewsSubscriptionPutBodyDto {

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 50)
    name: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 30)
    phone: string;

  @ApiProperty({ default: 'ivan@mail.ru' })
  @IsString()
  @IsOptional()
  @Length(1, 50)
    email: string;
}