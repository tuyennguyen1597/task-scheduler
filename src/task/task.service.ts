import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDTO } from '../common/dto/page-option.dto';
import { PageDTO } from '../common/dto/page.dto';
import { Task } from '../models/task.entity';
import { CacheService } from '../shared/cache/cache.helper';
import { PaginationService } from '../shared/pagination.helper';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Schedule } from '../models/scheduler.entity';
import { ScheduleService } from '../schedule/schedule.service';
import { FilterScheduleDTO } from '../schedule/dto/filter-schedule.dto';

@Injectable()
export class TaskService {
    constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        private readonly scheduleService: ScheduleService,
        private readonly paginationService: PaginationService,
        private readonly cache: CacheService
    ) { }
    private TASK = 'task'

    async findAll(pageOption?: PageOptionsDTO): Promise<PageDTO<Task>> {
        let tasks: Task[] = await this.cache.getValue(this.TASK)

        if (!tasks || !tasks.length) tasks = await this.taskRepository.find();

        this.cache.setValue(this.TASK, tasks)

        return this.paginationService.withPage(tasks, pageOption);
    }

    async finById(id: string): Promise<Task> {
        var task: Task = await this.cache.getValueById(this.TASK, id);

        if (task) return task

        return await this.taskRepository.findOneBy({ id });
    }

    async create(createTaskDTO: CreateTaskDTO): Promise<Task> {

        const newTask = new Task();
        const newSchedule = new FilterScheduleDTO();
        Object.assign(newSchedule, createTaskDTO.schedule);
        Object.assign(newTask, createTaskDTO)

        let schedule = new Schedule();
        const schedules = (await this.scheduleService.findBy(newSchedule)).data;

        if (schedules && schedules.length) newTask.schedule = schedules[0];
        else {
            Object.assign(schedule, newSchedule)
            newTask.schedule = schedule
        }

        const createdTask = await this.taskRepository.save(newTask);
    
        await this.cache.addValueToCache(this.TASK, createdTask)
        return createdTask
    }

    async update(id: string, updateTaskDto: UpdateTaskDTO) {
        // Check if the entity exists
        const task = await this.finById(id);

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        for (const key in updateTaskDto) {
            if (updateTaskDto.hasOwnProperty(key)) {
                task[key] = updateTaskDto[key];
            }
        }
        
        // Update the entity with the properties from the DTO
        const updatedTask = await this.taskRepository.save(task);
        this.cache.addValueToCache(this.TASK, updatedTask);

        return updatedTask;
    }

    async delete(id: string) {
        const task = await this.finById(id)

        if (!task) throw new NotFoundException('Task Not Found');

        await this.taskRepository.delete(id);

        const isDeleted = !(await this.taskRepository.findOneBy({ id }));

        if (isDeleted) {
            await this.cache.removeValue(this.TASK, task);
        }
    }
}