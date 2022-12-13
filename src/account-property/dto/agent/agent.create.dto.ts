import { IAgent } from '../../interfaces/agent/agent.interface';
import { IAgency } from '../../interfaces/agency/agency.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IFile } from '../../../file/interfaces/IFile';
import { FileCreateDto } from '../../../file/dto/file.create.dto';

export class AgentCreateDto implements IAgent {
  @ApiProperty()
  agencyId: IAgency;

  @ApiProperty()
  experience: Date;

  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  inviteLink: string;

  @ApiProperty()
  messengers: object;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: object[];

  @ApiProperty()
  position: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  files?: FileCreateDto[]
}
