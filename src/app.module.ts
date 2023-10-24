import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from './schedule/schedule.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes'
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database/postgres.provider';
import { redisStore } from 'cache-manager-redis-store';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.register({
      // @ts-ignore
      store: async () => await redisStore({
        socket: {
          host: process.env.R_HOST,
          port: Number(process.env.R_PORT),
        }
      }),
      isGlobal: true
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule,
    TaskModule,
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
