import {
  OnGlobalQueueCompleted,
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Job } from 'bull';
import { Socket } from 'dgram';
import { AppService } from './app.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:4200' } })
@Processor('stQueue')
export class StudentProcessor {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(StudentProcessor.name);

  @WebSocketServer()
  socket;

  @Process('saveStudent')
  async saveStudent(job: Job) {

    let item = job.data

    console.log("job dima ", item.fileName)
    ////###################################################################

    var xlsx = require('xlsx');

    var wb = xlsx.readFile('./uploads/' + item.fileName);
    var wsName: string = wb.SheetNames[0];
    var ws = wb.Sheets[wsName];

    var data = xlsx.utils.sheet_to_json(ws, { header: 1 });
    let x: any = data[0];
    //var dataToUpload = new Student();
    let dataToUpload: any[] = [];

    for (let index = 1; index < data.length; index++) {
      let x: any = data[index];

      dataToUpload.push({
        name: x[0],
        email: x[1],
        dateOfBirth: new Date((x[2] - 25569) * 86400000),
        age:
          new Date().getFullYear() -
          new Date((x[2] - 25569) * 86400000).getFullYear(),
      });

    }

    // add to queue here


    ////##########################################################

    await this.appService.saveStudent(dataToUpload);
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  @OnQueueActive()
  onActive(job: Job) {
  }

  // @OnQueueCompleted()
  // async onQueueCompleted(jobId: number, result: any){
  //     this.socket.emit('events', {name: 'Nest'});
  //}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {
    ////////////////
    this.socket.emit('events', { name: 'Nest' });
  }
}
