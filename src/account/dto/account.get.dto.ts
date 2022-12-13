import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsString, IsEmail } from 'class-validator';

import { IAccount } from '../interfaces/account.interface';
import { TRole } from '../types/role';
import { BaseDto } from '../../common/dto/base.dto';
import { ICustomer } from 'src/account-property/interfaces/customer/customer.interface';
import { IDeveloper } from 'src/account-property/interfaces/developer/developer.interface';
import { IAgency } from 'src/account-property/interfaces/agency/agency.interface';
import { IAgent } from 'src/account-property/interfaces/agent/agent.interface';
import { IAdmin } from 'src/account-property/interfaces/admin/admin.interface';
import { AgentCreateDto } from '../../account-property/dto/agent/agent.create.dto';
import { AgencyCreateDto } from '../../account-property/dto/agency/agency.create.dto';

export class AccountGetResponseDto extends BaseDto implements IAccount {

  @IsString()
  @ApiProperty()
  @IsEmail()
  email: string;


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

  @ApiProperty()
  customerProperty?: ICustomer;

  @ApiProperty()
  developerProperty?: IDeveloper;

  @ApiProperty()
  agencyProperty?: IAgency;

  @ApiProperty()
  agentProperty?: AgentCreateDto;

  @ApiProperty()
  adminProperty?: IAdmin;
}
