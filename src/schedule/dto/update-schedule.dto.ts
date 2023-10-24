import { IsDateString, IsNumber, IsOptional, IsUUID } from "class-validator";

export class UpdateScheduleDTO {
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