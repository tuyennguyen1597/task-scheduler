import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/models/task.entity';
import { PaginationService } from 'src/shared/pagination.helper';
import { CacheService } from 'src/shared/cache/cache.helper';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
    imports: [TypeOrmModule.forFeature([Task]), ScheduleModule],
    controllers: [TaskController],
    providers: [TaskService, PaginationService, CacheService],
})
export class TaskModule {};