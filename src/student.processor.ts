import { OnGlobalQueueCompleted, OnQueueActive, OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Job } from "bull";
import { Socket } from "dgram";
import { AppService } from './app.service';


@WebSocketGateway({cors: {origin: 'http://localhost:4200'}})
@Processor('stQueue')
export class StudentProcessor {
    constructor(private readonly appService: AppService, ){}
    private readonly logger = new Logger(StudentProcessor.name);

    @WebSocketServer()
    socket;

    @Process('saveStudent')
    async saveStudent(job: Job){

        console.log("Student list job data ", job.data)
        await this.appService.saveStudent(job.data.studentList);
    }

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string):string {
        return data;
    }

    @OnQueueActive()
    onActive(job: Job){
        console.log(
            `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
        );
    }

    // @OnQueueCompleted()
    // async onQueueCompleted(jobId: number, result: any){
    //     this.socket.emit('events', {name: 'Nest'});
    //}

    @OnGlobalQueueCompleted()
    async onGlobalCompleted(jobId: number, result: any){
        console.log('(Global) on completed: job ', jobId, ' -> result: ', result);
        ////////////////
        this.socket.emit('events', {name: 'Nest'});
    }
    
}