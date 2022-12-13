import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto'

@Injectable()
export class MinioClientService {
  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
  ) {}

  public async upload(file) {
    const fileBuffer = file.buffer;
    const metaData: {'Content-Type': string} = {
      'Content-Type': file.mimetype,
    }
    const baseBucket = 'mp-data'

    let temp_filename = Date.now().toString();
    let hashedFileName = crypto.createHash('md5').update(temp_filename).digest("hex");
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    let filename = hashedFileName + ext
    const fileName: string = `${filename}`;

    await this.client.putObject(baseBucket,fileName,fileBuffer,file.mimetype, function(err, res) {
      if(err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    })

    return {
      size: file.size,
      mimeType: file.mimetype,
      fileName,
      url: `http://s3.dtln.ru:80/mp-data/${fileName}`
    }
  }

  // async delete(objectName: string, baseBucket: string = 'mp-data') {
  //   this.client.removeObject(baseBucket, objectName, function (err, res) {
  //     if(err) throw new HttpException('Err', HttpStatus.BAD_REQUEST)
  //   })
  // }
}
