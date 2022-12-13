import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsString, Length, MaxLength, Min, ValidateNested } from "class-validator";
import { IDeveloper } from "../../../account-property/interfaces/developer/developer.interface";
import { IPress } from "../../../press/interfaces/press.interface";
import { PhonesDto } from "../common/phones.dto";
import { PressGetResponseDto } from "../../../press/dto/press.get.dto";

class Risks{
    @ApiProperty({default: `Индекс финансового риска`})
    @IsString()
    title: string;

    @ApiProperty({default: `Оценка вероятности неплатежеспособности компании`})
    @IsString()
    description: string;

    @ApiProperty({default: 0})
    @IsNumber()
    value: number;
}

class StatisticsItems{
    @ApiProperty({default: `Судебные дела`})
    @IsString()
    item: string;

    @ApiProperty({default: 15})
    @IsNumber()
    value: number;
}
class Statistics{
    @ApiProperty({default: `Арбитражные дела`})
    @IsString()
    title: string;
    
    @ApiProperty({ type: [StatisticsItems] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StatisticsItems)
    items: object[];
}

class ExtraOccupations{
    @ApiProperty({default: 1})
    @IsNumber()
    ord: number;

    @ApiProperty({default: `Подготовка к продаже собственного недвижимого имущества`})
    @IsString()
    value: string;
}

export class DeveloperPutBodyDto extends PhonesDto implements Omit<IDeveloper, 'id' | 'press' | 'completedComplexAmount' | 'inProgressComplexAmount' | 'completedBuildingAmount' | 'inProgressBuildingAmount'>  {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({default: `Девелоперская компания`})
    @IsOptional()
    @IsString()
    @MaxLength(30)
    type: string;
    
    @ApiProperty({default: `https://hilma.com`})
    @IsOptional()
    @IsString()
    @MaxLength(255)
    logo: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    address: string;

    @ApiProperty({default: `https://hilma.com`})
    @IsOptional()
    @IsString()
    @MaxLength(255)
    site: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    legalFullName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    legalAddress: string;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    authorizedCapital: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    OKFS: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    OKOPF: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    OKOGU: string;

    @ApiProperty({default: `000000000000`})
    @IsOptional()
    @IsString()
    @Length(12)
    INN: string;

    @ApiProperty({default: `0000000000000`})
    @IsOptional()
    @IsString()
    @Length(13)
    OGRN: string;

    @ApiProperty({default: `000000000`})
    @IsOptional()
    @IsString()
    @Length(9)
    KPP: string;

    @ApiProperty({default: `66 000 000 000`})
    @IsOptional()
    @IsString()
    @MaxLength(20)
    OKATO: string;

    @ApiProperty({default: `0000000000`})
    @IsOptional()
    @IsString()
    @MaxLength(10)
    OKPO: string;

    @ApiProperty({default: `00000000000`})
    @IsOptional()
    @IsString()
    @MaxLength(11)
    OKTMO: string;

    @ApiProperty({default: `Действующая`})
    @IsOptional()
    @IsString()
    status: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(80)
    leaderName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    founders: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    enterpriseSize: number;
    
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(0)
    numberOfStaff: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(0)
    branch: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    revenue: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()    
    netProfit: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()   
    netAssets: number;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    registrationDate: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    registrationAuthorityName: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    registrationAuthorityAddress: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    registeringAuthorityLocated: string;

    @ApiProperty({default: `Деятельность заказчика-застройщика`})
    @IsOptional()
    @IsString()
    mainOccupation: string;
    
    @ApiProperty({ type: [ExtraOccupations] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExtraOccupations)
    extraOccupations: object[];
    
    @ApiProperty({ type: [Statistics] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Statistics)
    statistics: object[];

    @ApiProperty({ type: [Risks] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Risks)
    risks: object[];
}

export class DeveloperPutResponseDto extends DeveloperPutBodyDto implements IDeveloper{
    @ApiProperty({ type: [PressGetResponseDto] })
    press: IPress[];

    @ApiProperty()
    completedComplexAmount: number;

    @ApiProperty()
    inProgressComplexAmount: number;

    @ApiProperty()
    completedBuildingAmount: number;

    @ApiProperty()
    inProgressBuildingAmount: number;

    @ApiProperty()
    id: number;
}