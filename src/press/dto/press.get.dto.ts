import { ApiProperty } from "@nestjs/swagger";
import { BaseIdDto } from "../../common/dto/base.dto";
import { IPress } from "../interfaces/press.interface";

export class PressGetResponseDto extends BaseIdDto implements IPress {
    @ApiProperty()
    date: Date;

    @ApiProperty()
    text: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    link: string;

    @ApiProperty()
    logo: string;
}