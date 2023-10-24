import { Injectable, NotFoundException } from '@nestjs/common';
import { Schedule } from '../models/scheduler.entity';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { PaginationService } from 'src/shared/pagination.helper';
import { PageDTO } from 'src/common/dto/page.dto';
import { PageOptionsDTO } from 'src/common/dto/page-option.dto';
import { CacheService } from 'src/shared/cache/cache.helper';
import { FilterScheduleDTO } from './dto/filter-schedule.dto';

@Injectable()
export class ScheduleService {
    private SCHEDULE = 'schedule'
    constructor(@InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>,
        private readonly paginationService: PaginationService,
        private readonly cache: CacheService
    ) { }

    async findAll(pageOption?: PageOptionsDTO): Promise<PageDTO<Schedule>> {
        let schedules: Schedule[] = await this.cache.getValue(this.SCHEDULE)

        if (!schedules || !schedules.length) schedules = await this.scheduleRepository.find();

        this.cache.setValue(this.SCHEDULE, schedules)

        return this.paginationService.withPage(schedules, pageOption);
    }

    async create(createScheduleDto: CreateScheduleDTO): Promise<Schedule> {
        const newSchedule = new Schedule();
        Object.assign(newSchedule, createScheduleDto);

        const createdSchedule = await this.scheduleRepository.save(newSchedule);
        // add new created schedule to the cache
        await this.cache.addValueToCache(this.SCHEDULE, createdSchedule)
        return createdSchedule
    }

    async finById(id: string): Promise<Schedule> {
        var schedule: Schedule = await this.cache.getValueById(this.SCHEDULE, id);

        if (schedule) return schedule

        return await this.scheduleRepository.findOneBy({ id });
    }

    async findBy(filter: FilterScheduleDTO, pageOption?: PageOptionsDTO) {
        if (!filter) return await this.findAll();

        const schedules = await this.scheduleRepository.findBy({
            accountId: filter.accountId,
            agentId: filter.agentId,
            startTime: filter.startDate,
            endTime: filter.endDate
        })

        return this.paginationService.withPage(schedules, pageOption);
    }

    async update(id: string, updateScheduleDto: UpdateScheduleDTO) {
        // Check if the entity exists
        const schedule = await this.finById(id);

        if (!schedule) {
            throw new NotFoundException('Schedule not found');
        }

        for (const key in updateScheduleDto) {
            if (updateScheduleDto.hasOwnProperty(key)) {
                schedule[key] = updateScheduleDto[key];
            }
        }
        // Update the entity with the properties from the DTO
        const updatedSchedule = await this.scheduleRepository.save(schedule);
        this.cache.addValueToCache(this.SCHEDULE, updatedSchedule);

        return updatedSchedule;
    }

    async delete(id: string) {
        const schedule = await this.finById(id)

        if (!schedule) throw new NotFoundException('Schedule Not Found');
        
        await this.scheduleRepository.delete(id);

        const isDeleted = !(await this.scheduleRepository.findOneBy({ id }));

        if (isDeleted) {
            await this.cache.removeValue(this.SCHEDULE, schedule);
        }
    }
}