import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Queue } from 'bull';

import { diskStorage } from 'multer';

import { AppService } from './app.service';

import { Student } from './student/student.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('stQueue') private studendQueue: Queue,
    private studentEntity: Student,
  ) {}

  @Post('fileUpload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async save(@UploadedFile() file): Promise<any> {
    

    const job = await this.studendQueue.add(
      'saveStudent',
      {
        fileName: file.originalname,
      },
      {
        attempts: 3,
        backoff: 3000,
      },
    );
    return;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
