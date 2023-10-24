import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv'
import { Schedule } from 'src/models/scheduler.entity';
import { Task } from 'src/models/task.entity';
dotenv.config()

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Schedule, Task],
  synchronize: false
};

export default new DataSource(databaseConfig);