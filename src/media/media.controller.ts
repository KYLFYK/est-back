import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../account/decorators/roles';
import { TRole } from '../account/types/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAccount } from '../account/decorators/currentAccount';
import { IAccount } from '../account/interfaces/account.interface';
import { FileService } from '../file/file.service';
import { FileInterceptorOptions } from '../common/const/FileInterceptorOptions';
import { MinioClientService } from '../minio-client/minio.client.service';

@ApiTags('Загрузка файла')
@Controller('media')
export class MediaController {
  constructor(
    private readonly minioClientService: MinioClientService,
  ) {}

  @Inject()
  private readonly fileService: FileService;

  @Post('s3-upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {

    const uploadedFile = await this.minioClientService.upload(file)
    return uploadedFile;
  }


  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.admin, TRole.agent, TRole.developer, TRole.bank)
  @ApiOperation({ summary: 'Загрузка еденичного файла' })
  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', FileInterceptorOptions))
  @Post('file')
  async uploadFile(@CurrentAccount() account: IAccount, @UploadedFile() file): Promise<any> {
    if (file) {
      // return this.fileService.saveFile({
      //   fileName: file.filename,
      //   url: `/public/upload/${file.filename}`,
      //   mimeType: file.mimetype,
      //   size: file.size,
      // })
    } else {
      throw new BadRequestException('File cannot be empty');
    }
  }

}
