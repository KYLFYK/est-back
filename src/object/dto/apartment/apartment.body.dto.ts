import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ObjectBodyDto } from '../object.body.dto';
import { IApartment } from '../../interfaces/apartment/apartment.interface';
import { IComplex } from '../../interfaces/complex/complex.interface';
import { IApartmentProperty } from '../../../object-property/interfaces/apartment/apartmentProperty.interface';
import { TConstructionFeatures } from '../../../object-property/types/construction-features';
import { TRooms } from '../../../object-property/types/rooms';
import { IsNumber, IsOptional, Min } from 'class-validator';

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

class ApartmentPropertyBodyDto implements Omit<IApartmentProperty, 'id'> {
  @ApiProperty({ example: 2, description: 'Номер этажа', required: false, type: 'number' })
  floor: number;

  @ApiProperty({ example: 9, description: 'Количество этажей' })
  totalFloor: number;

  @ApiProperty({ example: 50.8, description: 'Общая площадь квартиры' })
  area: number;

  @ApiProperty({ example: 30.5, description: 'Жилая площадь квартиры' })
  livingArea: number;

  @ApiProperty({ example: 5.3, description: 'Площадь санузлов' })
  bathroomArea: number;

  @ApiProperty({ example: 15.0, description: 'Площадь кухни' })
  kitchenArea: number;

  @ApiProperty({ type: [Number], example: [20.5, 10], description: 'Площадь комнат' })
  roomsArea: number[];

  @ApiProperty({ example: 1, description: 'Кол-во санузлов' })
  amountBathrooms: number;

  @ApiProperty({ example: 1, description: 'Кол-во спальных комнат' })
  amountBedrooms: number;

  @ApiProperty({ example: 1, description: 'Кол-во душевых' })
  amountShowers: number;

  @ApiProperty({ example: 1, description: 'Номер корпуса' })
  buildingNumber: number;

  @ApiProperty({ example: 3.3 })
  heightCeilings: number;

  @ApiProperty()
  deadline: Date;

  @ApiProperty()
  interior: string;

  @ApiProperty()
  infrastructure: string;

  @ApiProperty({
    example: TRooms.one,
    type: 'enum',
    enum: TRooms,
    default: TRooms.one,
  })
  rooms: TRooms;

  @ApiProperty({ example: 'https://www.youtube.com/embed/Ke3qyQYNob4' })
  threeD: string;

  @ApiProperty({ example: 'https://3d-tur.ru/010/' })
  vr: string;

  @ApiProperty( {type: [ConstructionFeatures]} )
  constructionFeatures: object[];
}

export class ApartmentBodyDto extends ObjectBodyDto implements Omit<IApartment, 'id' | 'createAt' | 'updateAt' | 'property' | 'views' | 'favorite' | 'city' | 'markAsDelete' | 'file'>  {

  @ApiProperty({ default: 1000 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  price: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  complex: IComplex;

  @ApiProperty({ type: ApartmentPropertyBodyDto })
  @IsOptional()
  property: ApartmentPropertyBodyDto;

  @ApiPropertyOptional({
    default: false
  })
  @IsOptional()
  markAsDelete: boolean;

}
