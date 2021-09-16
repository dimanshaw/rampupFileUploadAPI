import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import {Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { map } from 'rxjs';



@Injectable()
export class AppService {
  constructor(private httpService: HttpService,
    // @InjectQueue('stQueue') private studentQueue: Queue
    ) {}


  saveStudent(param) {

    console.log("Save Student!!!", param)

    return this.httpService
      .post('http://localhost:3000/api/student', param, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).subscribe((res) => {
        console.log("Student save post ", res)
      })
  }

  getHello(): string {
    return 'Hello World!';
  }
}
