import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('schedules')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @ApiOperation({
        summary: 'Get all schedule',
    })
    @Get()
    async findAll() {
        try {
            return await this.scheduleService.findAll();
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({
        summary: 'Create a schedule',
    })
    @Post()
    async create(@Body() createScheduleDTO: CreateScheduleDTO) {
        try {
            return await this.scheduleService.create(createScheduleDTO);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update a schedule',
    })
    @ApiParam({ name: 'id', type: 'uuid', description: 'The ID of the item' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateScheduleDTO: UpdateScheduleDTO) {
        try {
            return await this.scheduleService.update(id, updateScheduleDTO);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({
        summary: 'Delete a schedule',
    })
    @ApiParam({ name: 'id', type: 'uuid', description: 'The ID of the item' })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.scheduleService.delete(id);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}