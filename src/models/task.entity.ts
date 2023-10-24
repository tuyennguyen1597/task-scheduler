import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Schedule } from './scheduler.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TaskType } from '../enum/task.enum';

@ObjectType()
@Entity()
export class Task extends BaseEntity {
    @Column({ name: 'account_id' })
    accountId: number;

    @ManyToOne(() => Schedule, scheduler => scheduler.tasks, { cascade: true, eager: true })
    @JoinColumn({ name: 'scheduler_id' })
    schedule: Schedule;

    @Column({ name: 'start_time' })
    startTime: Date;

    @Column()
    duration: number;

    @Column({
        type: 'enum',
        enum: TaskType,
        default: TaskType.Work
    })
    type: TaskType
}
