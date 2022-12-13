import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthRefreshBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    token: string;
}

export class AuthRefreshResponseDto {
  @ApiProperty({
    description: 'access token',
  })
    access: string;

  @ApiProperty({
    description: 'refresh token',
  })
    refresh: string;
}
