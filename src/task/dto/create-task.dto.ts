import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsObject, Min, Validate, ValidateNested } from "class-validator";
import { TaskType } from "src/enum/task.enum";
import { CreateScheduleDTO } from "src/schedule/dto/create-schedule.dto";
import { StartDateValidator } from "src/shared/start-date-validator.helper";

export class CreateTaskDTO {
    @ApiProperty({
        name: 'accountId',
        example: '1',
        type: Number
    })
    @IsInt()
    @Min(1, { message: 'Accoutn Id must be greater than 0' })
    accountId: number;

    @ApiProperty({
        name: 'startTime',
        example: '2026-10-24',
        type: Date
    })
    @IsNotEmpty()
    @IsDateString({ strict: true })
    @Validate(StartDateValidator, [])
    startTime: Date;

    @ApiProperty({
        name: 'duration',
        example: '1',
        type: Number
    })
    @IsInt()
    @Min(1, { message: 'Duration must be greater than 0' })
    duration: number;

    @ApiProperty({
        name: 'type',
        example: 'work',
        enum: TaskType
    })
    @IsEnum(TaskType, { message: 'Invalid task type. Please choose either work or break!' })
    type: TaskType

    @ApiProperty({
        type: () => CreateScheduleDTO, isArray: false
    })
    @Type(() => CreateScheduleDTO)
    @ValidateNested()
    @IsObject()
    schedule: CreateScheduleDTO
}
