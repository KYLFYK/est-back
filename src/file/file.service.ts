import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { IFile } from './interfaces/IFile';
import fs from 'fs';
import * as path from 'path';

import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>
  ) {}

  async findByIds(ids: IFile[]): Promise<FileEntity[]>{
    if (!ids){
      return []
    }
    return this.fileRepository.findByIds(ids)
  }

  async saveFile(fileData: Omit<IFile, 'id' | 'createAt' | 'updateAt'>): Promise<any> {
    return this.fileRepository.save(fileData)
    .catch(e => {
      throw new BadRequestException(e.message);
    });
  }

  async deleteFile(file: IFile){
    return this.fileRepository.remove(file)
    .catch(e => {
      throw new BadRequestException(e.message);
    });
  }

  async upload(file) {
    const { originalName } = file;
    const bucketS3 = 'mp-data';
    await this.uploadS3(file.buffer, bucketS3, originalName);
  }

  uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if(err) {
          reject(err.message)
        }
        resolve(data)
      })
    })
  }

  getS3() {
    return new S3({
      accessKeyId: '00b72667e8e05ad9b551',
      secretAccessKey: '/6tNn5iP8FPPHORwrm6ygN7DNPmi67Txe7RyONg7',
      region: 'web-s3.dtln.ru'
    })
  }
}
