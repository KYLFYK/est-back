import { Module } from '@nestjs/common';
import { MinioClientService } from './minio.client.service';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    MinioModule.register({
      endPoint: 's3.dtln.ru',
      port: 80,
      useSSL: false,
      accessKey: '00b72667e8e05ad9b551',
      secretKey: '/6tNn5iP8FPPHORwrm6ygN7DNPmi67Txe7RyONg7',
    })
  ],
  providers: [MinioClientService],
  exports: [MinioClientService]
})
export class MinioClientModule {}
