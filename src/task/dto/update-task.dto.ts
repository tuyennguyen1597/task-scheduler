import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, Min, Validate } from "class-validator";
import { TaskType } from "src/enum/task.enum";
import { StartDateValidator } from "src/shared/start-date-validator.helper";

export class UpdateTaskDTO {
    @IsOptional()
    @IsInt()
    @Min(1, { message: 'Accoutn Id must be greater than 0' })
    accountId: number;

    @IsOptional()
    @IsNotEmpty()
    @IsDateString({ strict: true })
    @Validate(StartDateValidator, [])
    startTime: Date;

    @IsOptional()
    @IsInt()
    @Min(1, { message: 'Duration must be greater than 0' })
    duration: number;

    @IsOptional()
    @IsEnum(TaskType, { message: 'Invalid task type. Please choose either work or break!' })
    type: TaskType
}
