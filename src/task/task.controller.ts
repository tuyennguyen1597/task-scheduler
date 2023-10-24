import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
    constructor( private readonly taskService: TaskService){}

    @Get()
    async findAll() {
        try {
            return await this.taskService.findAll();
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post()
    async create(@Body() createScheduleDTO: CreateTaskDTO) {
        try {
            return await this.taskService.create(createScheduleDTO);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateScheduleDTO: UpdateTaskDTO) {
        try {
            return await this.taskService.update(id, updateScheduleDTO);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.taskService.delete(id);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}