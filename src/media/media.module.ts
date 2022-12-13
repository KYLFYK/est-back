import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { MediaController } from './media.controller';
import { NestMinioModule } from 'nestjs-minio';
import { MediaService } from './media.service';
import { MinioClientModule } from '../minio-client/minio.client.module';

@Module({
  imports: [FileModule,
    MinioClientModule,
    NestMinioModule.register({
      endPoint: 's3.dtln.ru',
      port: 80,
      useSSL: false,
      accessKey: '00b72667e8e05ad9b551',
      secretKey: '6tNn5iP8FPPHORwrm6ygN7DNPmi67Txe7RyONg7',
    })],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
