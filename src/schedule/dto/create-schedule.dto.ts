import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Validate, ValidateIf, validate } from "class-validator";
import { EndDateValidator } from "src/shared/end-date-validator.helper";
import { StartDateValidator } from "src/shared/start-date-validator.helper";

export class CreateScheduleDTO {
    @IsNotEmpty()
    @IsDateString({ strict: true })
    @Validate(StartDateValidator, ['endTime'])
    startTime: Date;

    @IsNotEmpty()
    @IsDateString({ strict: true})
    @Validate(EndDateValidator, ['startTime'])
    endTime: Date;

    @IsOptional()
    @IsNumber()
    accountId: number;

    @IsOptional()
    @IsNumber()
    agentId: number;
}