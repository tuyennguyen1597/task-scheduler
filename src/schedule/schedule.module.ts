import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/models/scheduler.entity';
import { PaginationService } from 'src/shared/pagination.helper';
import { CacheService } from 'src/shared/cache/cache.helper';
import { ScheduleController } from './schedule.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Schedule])],
    providers: [ScheduleService, PaginationService, CacheService],
    controllers: [ScheduleController],
    exports: [ScheduleService]
})
export class ScheduleModule { };