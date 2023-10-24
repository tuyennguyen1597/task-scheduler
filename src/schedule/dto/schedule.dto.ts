import { BaseDTO } from "../../common/dto/base.dto";
import { Schedule } from "src/models/scheduler.entity";

export class ScheduleDTO extends BaseDTO {
    scheduleInfo: Schedule
}