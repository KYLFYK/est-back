import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsString, IsEmail, IsOptional } from 'class-validator';

import { TRole } from '../types/role';

/* interface section */
import { IAccount } from '../interfaces/account.interface';
import { IAccountChange } from '../interfaces/account.interface.change';
/* */

/* dto section */
import { BaseDto } from '../../common/dto/base.dto';
import { ICustomer } from '../../account-property/interfaces/customer/customer.interface';
import { IDeveloper } from '../../account-property/interfaces/developer/developer.interface';
import { IAgency } from '../../account-property/interfaces/agency/agency.interface';
import { AgentCreateDto } from '../../account-property/dto/agent/agent.create.dto';
import { FileCreateDto } from '../../file/dto/file.create.dto';
/* */

export class AccountChangeBodyDto implements IAccountChange {

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly phone?: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: TRole,
    default: TRole.customer,
  })
  @IsOptional()
  @IsEnum(TRole)
  readonly role?: TRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly markAsDelete?: boolean;

  @ApiProperty()
  file?: FileCreateDto[];

  @ApiProperty()
  @IsOptional()
  customerProperty?: ICustomer;

  @ApiProperty()
  @IsOptional()
  developerProperty?: IDeveloper;

  @ApiProperty()
  @IsOptional()
  agencyProperty?: IAgency;

  @ApiProperty()
  @IsOptional()
  agentProperty?: AgentCreateDto;

}

export class AccountChangeResponseDto extends BaseDto implements Omit<IAccount, 'customerProperty' | 'developerProperty' | 'agencyProperty' | 'agentProperty' | 'adminProperty'> {

  @IsString()
  @ApiProperty()
  @IsEmail()
    email: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @IsEnum(TRole)
  @ApiProperty({
    type: 'enum',
    enum: TRole,
    default: TRole.customer,
  })
    role: TRole;

  @IsBoolean()
  @ApiProperty()
    markAsDelete: boolean;

  @IsBoolean()
  @ApiProperty()
    isConfirmed: boolean;
}

export class AccountChangeRoleResponseDto extends AccountChangeResponseDto {}

export class AccountMarkResponseDto extends AccountChangeResponseDto {}
