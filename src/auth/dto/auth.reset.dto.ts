import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AccountGetResponseDto } from '../../account/dto/account.get.dto';

export class AuthResetBodyDto {
  @ApiProperty({ description: 'Логин (email)' })
  @IsEmail()
    email: string;
}

export class AuthResetResponseDto extends AuthResetBodyDto {}

/* dto когда нажимаешь на ссылку в почте */
export class AuthResetLinkResponseDto extends AccountGetResponseDto {}
/* */
