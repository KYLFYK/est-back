import { ApiProperty } from '@nestjs/swagger';
import { ObjectBodyDto } from '../object.body.dto';
import { IComplex } from '../../interfaces/complex/complex.interface';
import { IComplexProperty } from '../../../object-property/interfaces/complex/complexProperty.interface';
import { ArrayUnique, IsArray, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConstructionProgressPostBodyDto } from '../../../construction-progress/dto/construction-progress.post.dto';
import { ICity } from '../../../city/interfaces/city.interface';
import { ICountry } from '../../../country/interfaces/country.interface';
import { IRegion } from '../../../region/interfaces/region.interface';
import { TObjectType } from '../../types/TObjectType';
import { IFile } from '../../../file/interfaces/IFile';
import { FileCreateDto } from '../../../file/dto/file.create.dto';
import { IGuide } from '../../../guide/interfaces/guide.interface';
import { IStatus } from '../../interfaces/status/status.interface';
import { IAccount } from '../../../account/interfaces/account.interface';


class ComplexPropertyBodyDto implements Omit<IComplexProperty, 'id'> {
  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @IsOptional()
  priceObjectMin: number;

  @ApiProperty({ example: 100000000 })
  @IsNumber()
  @IsOptional()
  priceObjectMax: number;

  @ApiProperty({ example: 55.8 })
  @IsNumber()
  @IsOptional()
  areaObjectMin: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @IsOptional()
  areaObjectMax: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsOptional()
  amountObjects: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsOptional()
  amountBuildings: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  amountFloors: number;

  @ApiProperty({ example: 3.3 })
  @IsNumber()
  @IsOptional()
  heightCeilings: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  infrastructure: string;
}

export class ComplexBodyDto implements Omit<IComplex, 'id' | 'createAt' | 'updateAt' | 'property' | 'constructionProgress' | 'views' | 'favorite' | 'markAsDelete' | 'owner'> {
  @ApiProperty({ default: TObjectType.sale, enum: TObjectType })
  @IsOptional()
  objectType: TObjectType;

  @ApiProperty({default: 'Лучший ЖК'})
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

  @ApiProperty({default: 44.948237  })
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

  @ApiProperty({ default: [5, 10, 15, 20, 22] })
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

  @ApiProperty({
    type: () => FileCreateDto,
  })
  @IsOptional()
  @Type(() => FileCreateDto)
  readiness: IFile;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ComplexPropertyBodyDto)
  property: ComplexPropertyBodyDto;

  @ApiProperty({ type: [ConstructionProgressPostBodyDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ConstructionProgressPostBodyDto)
  constructionProgress: ConstructionProgressPostBodyDto[];
}
