import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { IAgent } from "src/account-property/interfaces/agent/agent.interface";
import { PhonesDto } from "../common/phones.dto";
import { FileCreateDto } from '../../../file/dto/file.create.dto';
import { IFile } from '../../../file/interfaces/IFile';

class MessengerDto{
  @ApiProperty({default: `+7(999)999-99-99`})
  @IsString()
  @IsOptional()
  whatsApp: string;

  @ApiProperty({default: `+7(999)999-99-99`})
  @IsString()
  @IsOptional()
  telegram: string;
}

export class AgentPutBodyDto extends PhonesDto implements Omit<IAgent, 'id' | 'agencyId'> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  position: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  experience: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  inviteLink: string;

  @ApiProperty({ type: MessengerDto })
  @IsOptional()
  @Type(() => MessengerDto)
  @ValidateNested({ each: true })
  messengers: object;

  @IsArray()
  @Type(() => FileCreateDto)
  @ApiProperty({
    type: () => FileCreateDto,
    isArray: true
  })
  @IsOptional()
  file: IFile[];

}

