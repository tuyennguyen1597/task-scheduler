import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class FilterScheduleDTO {
    @IsOptional()
    @IsNumber()
    accountId: number;

    @IsOptional()
    @IsNumber()
    agentId: number;

    @IsOptional()
    @IsDateString({ strict: true })
    startDate: Date;

    @IsOptional()
    @IsDateString({ strict: true })
    endDate: Date;
}