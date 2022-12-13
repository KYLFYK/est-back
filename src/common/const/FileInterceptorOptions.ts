import { HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import { existsSync } from "fs";
import { diskStorage } from "multer";
import { extname } from 'path';
import * as path from 'path';
import { getRandomString } from "../utils/util.createHash";

export const FileInterceptorOptions = {
  limits: {
    fileSize: 1024000 * 25,
  },
  fileFilter: (req: any, file: any, callback: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|doc|docx|pdf|xls|xlsx|'application\/vnd.openxmlformats-officedocument.wordprocessingml.document')$/)) {
      callback(null, true);
    } else {
      const expansion = file.originalname.split('.')[file.originalname.split('.').length - 1];

      if (expansion === 'docx' || expansion === 'xlsx' || expansion === 'doc') {
        callback(null, true);
      } else {
        callback(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }

    }
  },
  storage: diskStorage({
    // Указываем куда записывать
    destination: (req: any, file: any, callback: any) => {
      const uploadPath = path.resolve( __dirname, '../../../', '../public/upload');
      if (!existsSync(uploadPath)) {
        callback(new BadRequestException('There is no such directory of the user. Contact your administrator.', ''));
      }
      callback(null, uploadPath);

    },

    filename: (req: any, file: any, callback: any) => {
      if (!file) {
        callback(new BadRequestException('File is can be empty', ''));
      } else {
        getRandomString(5).then(fileName => {
          callback(null, `${fileName}${extname(file.originalname)}`);
        });
        // callback(null, `${file.originalname.split('.')[0]}${extname(file.originalname)}`);

      }

    },
  }),

};