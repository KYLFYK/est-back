import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { IAgency } from "../../interfaces/agency/agency.interface";
import { PhonesDto } from "../common/phones.dto";

export class AgencyPutBodyDto extends PhonesDto implements Omit<IAgency, 'id' | 'status'> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  site: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

