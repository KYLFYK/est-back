import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class AuthConfirmResponseDto {
    @ApiProperty()
    @IsBoolean()
      success: boolean;
  }