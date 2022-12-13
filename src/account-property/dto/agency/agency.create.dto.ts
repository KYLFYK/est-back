import { IAgency } from '../../interfaces/agency/agency.interface';
import { PhonesDto } from '../common/phones.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AgencyCreateDto implements Omit<IAgency, 'id'> {
  @ApiProperty()
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  address: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  site: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  phone: object[];

  @ApiProperty()
  status: string;
}
