import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, IsArray, ValidateNested, IsOptional } from "class-validator";

class PhoneDto{
    @ApiProperty({default: 1})
    @IsNumber()
    ord: number;

    @ApiProperty({default: `+7(999)999-99-99`})
    @IsString()
    value: string;
}

export class PhonesDto{
    @ApiProperty({ type: [PhoneDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhoneDto)
    phone: object[];
}