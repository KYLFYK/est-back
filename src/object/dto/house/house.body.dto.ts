import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ArrayUnique, Min } from 'class-validator';
import { ObjectBodyDto } from '../object.body.dto';
import { IHouse } from '../../interfaces/house/house.interface';
import { IComplex } from '../../interfaces/complex/complex.interface';
import { IHouseProperty } from '../../../object-property/interfaces/house/houseProperty.interface';
import { TRooms } from '../../../object-property/types/rooms';
import { TConstructionFeatures } from '../../../object-property/types/construction-features';

class ConstructionFeatures {
  @ApiProperty({ example: 'Дом построен с учетом сейсмической безопасности' })
  title: string;

  @ApiProperty({
    example: TConstructionFeatures.foundation,
    type: 'enum',
    enum: TConstructionFeatures,
    default: TConstructionFeatures.foundation,
  })
  value: TConstructionFeatures;
}

class Floors {
  @ApiProperty({ example: 'Первый этаж' })
  floor: string;

  @ApiProperty({ example: 'Холл, кухня-гостиная, комната, кабинет, санузел' })
  value: string;
}

class HousePropertyBodyDto implements Omit<IHouseProperty, 'id'> {
  @ApiProperty({ example: 2, description: 'Кол-во этажей', type: 'number' })
  totalFloor: number;

  @ApiProperty({ example: 1, description: 'Кол-во санузлов', type: 'number' })
  amountBathrooms: number;

  @ApiProperty({ example: 2, description: 'Кол-во спален', type: 'number' })
  amountBedrooms: number;

  @ApiProperty({ example: 1, description: 'Кол-во душевых', type: 'number' })
  amountShowers: number;

  @ApiProperty({ example: 110, description: 'Площадь дома' })
  area: number;

  @ApiProperty({ example: 10, description: 'Площадь туалета' })
  bathroomArea: number;

  @ApiProperty({ type: [ConstructionFeatures] })
  constructionFeatures: object[];

  @ApiProperty({ type: [Floors] })
  floors: object[];

  @ApiProperty()
  infrastructure: string;

  @ApiProperty({ example: 10, description: 'Площадь кухни' })
  kitchenArea: number;

  @ApiProperty({ example: 200, description: 'Площадь земли м2' })
  landArea: number;

  @ApiProperty({ example: 50, description: 'Жилая площадь' })
  livingArea: number;

  @ApiProperty({ example: 'https://www.youtube.com/embed/Ke3qyQYNob4' })
  threeD: string;

  @ApiProperty({ example: 'https://3d-tur.ru/010/' })
  vr: string;

  @ApiProperty({ example: 200, description: 'Общая площадь м2' })
  totalArea: number;

    @ApiProperty({
    example: TRooms.two,
    type: 'enum',
    enum: TRooms,
    default: TRooms.two,
  })
  rooms: TRooms;

}

export class HouseBodyDto extends ObjectBodyDto implements Omit<IHouse, 'id' | 'createAt' | 'updateAt' | 'views' | 'property' | 'legalPurity' | 'favorite' | 'city' | 'complex' |'markAsDelete'>  {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  complex: IComplex;

  @ApiProperty({ type: HousePropertyBodyDto })
  @IsOptional()
  property: HousePropertyBodyDto;

  @ApiPropertyOptional({
    default: false
  })
  @IsOptional()
  markAsDelete: boolean;
}
