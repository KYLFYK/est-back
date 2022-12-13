import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { IPress } from "../interfaces/press.interface";
import { PressGetResponseDto } from "./press.get.dto";

export class PressPutBodyDto implements Omit<IPress, 'id'> {
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    text: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    link: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    logo: string;
}

export class PressPutResponseDto extends PressGetResponseDto{}