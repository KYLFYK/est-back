import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";
import { IPress } from "../interfaces/press.interface";
import { PressGetResponseDto } from "./press.get.dto";

export class PressPostBodyDto implements Omit<IPress, 'id'> {
    @ApiProperty()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    link: string;

    @ApiProperty()
    @IsString()
    logo: string;
}

export class PressPostResponseDto extends PressGetResponseDto{}