import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponseDto } from '../object.response.dto';
import { IComplexProperty } from '../../../object-property/interfaces/complex/complexProperty.interface';
import { Type } from 'class-transformer';
import { BaseIdDto } from '../../../common/dto/base.dto';
import { IConstructionProgress } from '../../../construction-progress/interfaces/construction-progress.interface';
import { IApartmentProperty } from '../../../object-property/interfaces/apartment/apartmentProperty.interface';
import { IApartment } from '../../../object/interfaces/apartment/apartment.interface';
import { ConstructionProgressPostBodyDto } from '../../../construction-progress/dto/construction-progress.post.dto';
import { ConstructionProgressGetResponseDto } from '../../../construction-progress/dto/construction-progress.get.dto';

class ComplexPropertyResponseDto extends BaseIdDto implements IComplexProperty {
    @ApiProperty({ example: 1000000 })
    priceObjectMin: number;

    @ApiProperty({ example: 100000000 })
    priceObjectMax: number;

    @ApiProperty({ example: 55.8 })
    areaObjectMin: number;

    @ApiProperty({ example: 200 })
    areaObjectMax: number;

    @ApiProperty({ example: 100 })
    amountObjects: number;

    @ApiProperty({ example: 2 })
    amountBuildings: number;

    @ApiProperty({ example: 10 })
    amountFloors: number;

    @ApiProperty({ example: 3.3 })
    heightCeilings: number;

    @ApiProperty()
    infrastructure: string;
}

export class ComplexResponseDto extends ObjectResponseDto {
    @ApiProperty()
    @Type(() => ComplexPropertyResponseDto)
    property: ComplexPropertyResponseDto;

    @ApiProperty({ type: [ConstructionProgressGetResponseDto] })
    @Type(() => ConstructionProgressGetResponseDto)
    constructionProgress: ConstructionProgressGetResponseDto[];    
}

export class ComplexGetOneResponseDto extends ComplexResponseDto {
    @ApiProperty({ default: [{}] })
    planningList: {
        price: IApartment['price'],
        name: IApartment['name'],
        buildingNumber: IApartmentProperty['buildingNumber'],
        deadline: IApartmentProperty['deadline'],
        floor: IApartmentProperty['floor']
    }[];    
}