import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TRole } from '../../account/types/role';

export class AuthCreateBodyDto {

  @ApiProperty({ description: 'Логин (email)' })
  @IsEmail()
    publicKey: string;

  @ApiProperty({ description: 'Пароль' })
  @IsNotEmpty()
  @IsString()
    privateKey: string;

  @ApiProperty({
    description: 'Роль',
    default: 'customer',
    enum: TRole,
  })
  @IsEnum(TRole)
    role: TRole;

  @ApiProperty({
    description: 'phone'
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string
}

export class AuthCreateResponseDto {
  @ApiProperty({
    description: 'access token',
  })
    access: string;

  @ApiProperty({
    description: 'refresh token',
  })
    refresh: string;
}
