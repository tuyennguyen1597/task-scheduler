import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, Min, Validate } from "class-validator";
import { TaskType } from "src/enum/task.enum";
import { StartDateValidator } from "src/shared/start-date-validator.helper";

export class UpdateTaskDTO {
    @ApiPropertyOptional({
        name: 'accountId',
        example: '1',
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Min(1, { message: 'Accoutn Id must be greater than 0' })
    accountId: number;

    @ApiPropertyOptional({
        name: 'startTime',
        example: '2026-10-24',
        type: Date
    })
    @IsOptional()
    @IsNotEmpty()
    @IsDateString({ strict: true })
    @Validate(StartDateValidator, [])
    startTime: Date;

    @ApiPropertyOptional({
        name: 'duration',
        example: '1',
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Min(1, { message: 'Duration must be greater than 0' })
    duration: number;

    @ApiPropertyOptional({
        name: 'type',
        example: 'work',
        enum: TaskType
    })
    @IsOptional()
    @IsEnum(TaskType, { message: 'Invalid task type. Please choose either work or break!' })
    type: TaskType
}
