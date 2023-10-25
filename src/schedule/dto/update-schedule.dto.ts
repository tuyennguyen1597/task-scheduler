import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsUUID } from "class-validator";

export class UpdateScheduleDTO {
    @ApiPropertyOptional({
        name: 'accountId',
        example: '1',
        type: Number
    })
    @IsOptional()
    @IsNumber()
    accountId: number;

    @ApiPropertyOptional({
        name: 'agentId',
        example: '1',
        type: Number
    })
    @IsOptional()
    @IsNumber()
    agentId: number;

    @ApiPropertyOptional({
        name: 'startDate',
        example: '2026-10-24',
        type: Date
    })
    @IsOptional()
    @IsDateString({ strict: true })
    startDate: Date;

    @ApiPropertyOptional({
        name: 'endDate',
        example: '2026-10-24',
        type: Date
    })
    @IsOptional()
    @IsDateString({ strict: true })
    endDate: Date;
}