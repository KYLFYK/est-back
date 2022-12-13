import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ArrayUnique, Min } from 'class-validator';
import { ObjectBodyDto } from '../object.body.dto';
import { ILand } from '../../interfaces/land/land.interface';
import { ILandProperty } from '../../../object-property/interfaces/land/landProperty.interface';

class LandPropertyBodyDto implements Omit<ILandProperty, 'id'> {
  @ApiProperty({ example: 100, description: 'Площадь участка' })
  area: number;

  @ApiProperty({ example: `На участке 30 плодовых деревьев (персики, нектарины, слива, вишня).` })
  infrastructure: string;
}

export class LandBodyDto extends ObjectBodyDto implements Omit<ILand, 'id' | 'createAt' | 'updateAt' | 'views' | 'property' | 'legalPurity' | 'favorite' | 'city' | 'markAsDelete'>  {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ type: LandPropertyBodyDto })
  @IsOptional()
  property: LandPropertyBodyDto;

  @ApiPropertyOptional({
    default: false
  })
  @IsOptional()
  markAsDelete: boolean;
}
