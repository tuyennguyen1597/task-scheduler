import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Task } from './task.entity';

@Entity()
export class Schedule extends BaseEntity {
    @Column({ name: 'account_id' })
    accountId: number;

    @Column({ name: 'agent_id' })
    agentId: number;

    @Column({ name: 'start_time', type: 'timestamptz' })
    startTime: Date;

    @Column({name: 'end_time', type: 'timestamptz'})
    endTime: Date;

    @OneToMany(() => Task, task => task.schedule)
    tasks: Task[];
}
