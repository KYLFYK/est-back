import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthCheckBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    token: string;
}

export class AuthCheckResponseDto {
  @ApiProperty()
  @IsNotEmpty()
    isActive: boolean;
}
