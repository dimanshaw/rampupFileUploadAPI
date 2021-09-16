import { OnGlobalQueueCompleted, OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { AppService } from './app.service';

@Processor('stQueue')
export class StudentProcessor {
    constructor(private readonly appService: AppService, ){}
    private readonly logger = new Logger(StudentProcessor.name);

    @Process('saveStudent')
    async saveStudent(job: Job){
        await this.appService.saveStudent(job.data);
    }

    @OnQueueActive()
    onActive(job: Job){
        console.log(
            `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
        );
    }

    @OnGlobalQueueCompleted()
    async onGlobalCompleted(jobId: number, result: any){
        console.log('(Global) on completed: job ', jobId, ' -> result: ', result);
    }
    
}