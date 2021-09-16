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
    //this.appService.readExcelFile(file.originalname);
    console.log('Excel received!!!!');
    var xlsx = require('xlsx');

    var wb = xlsx.readFile('./uploads/' + file.originalname);
    var wsName: string = wb.SheetNames[0];
    var ws = wb.Sheets[wsName];

    var data = xlsx.utils.sheet_to_json(ws, { header: 1 });
    let x: any = data[0];
    var dataToUpload = new Student();
    for (let index = 1; index < data.length; index++) {
      let x: any = data[index];
      dataToUpload.name = x[0];
      dataToUpload.email = x[1];
      dataToUpload.dateOfBirth = new Date((x[2] - 25569) * 86400000);
      dataToUpload.age = new Date().getFullYear() -
      new Date((x[2] - 25569) * 86400000).getFullYear();
      console.log('adding to the queue!!!');
      const job = await this.studendQueue.add('saveStudent', { // transcode
       // studentList: dataToUpload,
       name: x[0],
       email: x[1],
       dateOfBirth: new Date((x[2] - 25569) * 86400000),
       age: new Date().getFullYear() -
       new Date((x[2] - 25569) * 86400000).getFullYear()
      });
    }
    //this.appService.saveStudent(dataToUpload);
    return;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
