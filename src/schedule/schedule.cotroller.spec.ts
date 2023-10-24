// import { Test, TestingModule } from '@nestjs/testing';
// import { ScheduleController } from './schedule.controller';
// import { ScheduleService } from './schedule.service';
// import { HttpStatus, INestApplication } from '@nestjs/common';
// import { CreateScheduleDTO } from './dto/create-schedule.dto';

// describe('ScheduleController', () => {
//   let app: INestApplication;
//   let scheduleService: ScheduleService;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ScheduleController],
//       providers: [ScheduleService],
//     }).compile();

//     app = module.createNestApplication();
//     await app.init();

//     scheduleService = module.get<ScheduleService>(ScheduleService);
//   });

//   it('/schedules (GET) - should return an array of schedules', async () => {
//     const schedules = [{ id: '1', name: 'Schedule 1' }, { id: '2', name: 'Schedule 2' }];
//     jest.spyOn(scheduleService, 'findAll').mockResolvedValue(schedules);

//     const response = await supertest(app.getHttpServer()).get('/schedules').expect(HttpStatus.OK);

//     expect(response.body).toEqual(schedules);
//   });

//   it('/schedules (POST) - should create a new schedule', async () => {
//     const createScheduleDTO: CreateScheduleDTO = {
//       name: 'New Schedule',
//       // other fields...
//     };

//     const newSchedule = { id: '3', ...createScheduleDTO };
//     jest.spyOn(scheduleService, 'create').mockResolvedValue(newSchedule);

//     const response = await supertest(app.getHttpServer())
//       .post('/schedules')
//       .send(createScheduleDTO)
//       .expect(HttpStatus.CREATED);

//     expect(response.body).toEqual(newSchedule);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
