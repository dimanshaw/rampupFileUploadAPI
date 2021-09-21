import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { StudentProcessor } from './student.processor';
import { Student } from './student/student.entity';

@Module({
  imports: [HttpModule,
    BullModule.registerQueue({
      name: 'stQueue',
      redis: {
        port: 9000
      }
  }),
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      // host: '127.0.0.1',
      // host: 'host.docker.internal',

      port: 9000,
    }
  })],
  controllers: [AppController],
  providers: [AppService,
  StudentProcessor,
  Student],
})
export class AppModule {}
