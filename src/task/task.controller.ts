import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
    constructor( private readonly taskService: TaskService){}

    @ApiOperation({
        summary: 'Get all task',
    })
    @Get()
    async findAll() {
        try {
            return await this.taskService.findAll();
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({
        summary: 'Create a task',
    })
    @Post()
    async create(@Body() createTaskDto: CreateTaskDTO) {
        try {
            return await this.taskService.create(createTaskDto);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({
        summary: 'Update a task',
    })
    @ApiParam({ name: 'id', type: 'number', description: 'The ID of the item' })
    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDTO: UpdateTaskDTO) {
        try {
            return await this.taskService.update(id, updateTaskDTO);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({
        summary: 'Delete a task',
    })
    @ApiParam({ name: 'id', type: 'number', description: 'The ID of the item' })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.taskService.delete(id);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}