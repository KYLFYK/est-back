import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginBodyDto {

  @ApiProperty({
    description: 'Логин (email)',
    default: 'admin@mail.ru',
  })
  @IsEmail()
    publicKey: string;

  @ApiProperty({
    description: 'Пароль',
    default: '123',
  })
  @IsNotEmpty()
  @IsString()
    privateKey: string;
}

export class AuthLoginResponseDto {
  @ApiProperty({
    description: 'access token',
  })
    access: string;

  @ApiProperty({
    description: 'refresh token',
  })
    refresh: string;
}
