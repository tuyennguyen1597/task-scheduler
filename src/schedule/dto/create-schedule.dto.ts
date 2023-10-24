import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Validate } from "class-validator";
import { EndDateValidator } from "src/shared/end-date-validator.helper";
import { StartDateValidator } from "src/shared/start-date-validator.helper";

export class CreateScheduleDTO {
    @ApiProperty({
        name: 'startTime',
        example: '2026-10-24',
        type: Date
    })
    @IsNotEmpty()
    @IsDateString({ strict: true })
    @Validate(StartDateValidator, ['endTime'])
    startTime: Date;

    @ApiProperty({
        name: 'endTime',
        example: '2026-10-24',
        type: Date
    })
    @IsNotEmpty()
    @IsDateString({ strict: true})
    @Validate(EndDateValidator, ['startTime'])
    endTime: Date;

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
}