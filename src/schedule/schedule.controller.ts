import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';

@Controller('schedules')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Get()
    async findAll() {
        try {
            return await this.scheduleService.findAll();
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post()
    async create(@Body() createScheduleDTO: CreateScheduleDTO) {
        try {
            return await this.scheduleService.create(createScheduleDTO);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateScheduleDTO: UpdateScheduleDTO) {
        try {
            return await this.scheduleService.update(id, updateScheduleDTO);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.scheduleService.delete(id);
        } catch (error) {
            throw new HttpException(error.status, error.message || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}