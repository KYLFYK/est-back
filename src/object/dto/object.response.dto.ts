import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

import { BaseDto } from '../../common/dto/base.dto';

import { IBaseObject } from '../interfaces/baseObject.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { IStatus } from '../interfaces/status/status.interface';
import { IGuide } from '../../guide/interfaces/guide.interface';
import { IRegion } from '../../region/interfaces/region.interface';
import { Type } from 'class-transformer';
import { AccountGetResponseDto } from '../../account/dto/account.get.dto';
import { RegionGetResponseDto } from '../../region/dto/region.get.dto';
import { IFile } from 'src/file/interfaces/IFile';

export class ObjectResponseDto extends BaseDto  {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  longitude: number;

  @ApiProperty()
  @IsString()
  latitude: number;

  @ApiProperty()
  @Type(() => RegionGetResponseDto)
  region: RegionGetResponseDto;

  @ApiProperty()
  @Type(() => AccountGetResponseDto)
  owner: AccountGetResponseDto;

  @ApiProperty()
  status: IStatus;

  @ApiProperty()
  @IsBoolean()
  markAsDelete: boolean;

  @ApiProperty()
  @IsString()
  objectType: string;

  @ApiProperty({ default: [{}] })
  guides: IGuide[];

  @ApiProperty({ default: [{}] })
  files: IFile[];
}
