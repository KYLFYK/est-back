import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, ArrayUnique, IsArray } from 'class-validator';

import { IBaseObject } from '../interfaces/baseObject.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { IStatus } from '../interfaces/status/status.interface';
import { IGuide } from 'src/guide/interfaces/guide.interface';
import { IRegion } from 'src/region/interfaces/region.interface';
import { IFile } from 'src/file/interfaces/IFile';
import { ICity } from 'src/city/interfaces/city.interface';
import { ICountry } from '../../country/interfaces/country.interface';
import { LegalPurityBodyDto } from '../../leagal-purity/dto/legal-purity.body.dto';
import { ILegalPurity } from '../../leagal-purity/interfaces/ILegalPurity';
import { TObjectType } from '../types/TObjectType';
import { FileCreateDto } from '../../file/dto/file.create.dto';
import { Type } from 'class-transformer';

export class ObjectBodyDto implements Omit<IBaseObject, 'id' | 'createAt' | 'updateAt' | 'price' | 'views' | 'favorite' | 'city' | 'markAsDelete'> {

  @ApiProperty({ default: TObjectType.sale, enum: TObjectType })
  @IsOptional()
  objectType: TObjectType;

  @ApiProperty({default: 'Лучший объект в Сочи'})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({default: 'Из окон открывается красивейший вид. Рядом пристань для яхт и катеров'})
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({default: 'Городской округ Сочи, посёлок городского типа Дагомыс, Балтийская улица, 2'})
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({default: '123456', required: false})
  @IsString()
  @IsOptional()
  postcode: string;

  @ApiProperty({default: 44.948237})
  @IsNumber()
  @IsOptional()
  longitude: number;

  @ApiProperty({default: 34.100318})
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiProperty({ default: 1, type: 'number', minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  region: IRegion;

  @ApiProperty({ default: 1, type: 'number', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  country: ICountry;

  @ApiProperty({ default: 1, type: 'number', required: false, minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  city: ICity;

  @ApiProperty({ default: 1, type: 'number', minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  owner: IAccount;

  @ApiProperty({ default: 1, type: 'number', minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  status: IStatus;

  @ApiProperty({ required: false, type: LegalPurityBodyDto })
  @IsOptional()
  legalPurity: ILegalPurity;

  @ApiProperty({ default: [5, 10, 15, 20] })
  @IsArray()
  @IsOptional()
  @ArrayUnique()
  @IsNumber({}, {each:true})
  guides: IGuide[];

  @IsArray()
  @Type(() => FileCreateDto)
  @ApiProperty({
    type: () => FileCreateDto,
    isArray: true
  })
  @IsOptional()
  files: IFile[];
}
