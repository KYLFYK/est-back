import { IFile } from '../interfaces/IFile';
import { ApiProperty } from '@nestjs/swagger';

export class FileCreateDto implements Omit<IFile, 'id'|'createAt'|'updateAt'> {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  url: string;
}
