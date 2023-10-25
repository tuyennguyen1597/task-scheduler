import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Repository } from 'typeorm';
import { Schedule } from '../models/scheduler.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationService } from '../shared/pagination.helper';
import { CacheService } from '../shared/cache/cache.helper';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ScheduleController', () => {
    let scheduleController: ScheduleController;
    let scheduleService: ScheduleService;
    let scheduleRepository: Repository<Schedule>;
    let pageService: PaginationService;
    let cacheService: CacheService;

    const SCHEDULE_REPOSITORY_TOKEN = getRepositoryToken(Schedule);

    const mockCache = {
        addValueToCache: jest.fn()
    }

    const mockPage = {
        withPage: jest.fn((schedules) => {
            return {
                data: schedules,
                meta: {
                    page: 1,
                    take: 2,
                    itemCount: 2,
                    pageCount: 1,
                    hasPreviousPage: false,
                    hasNextPage: false
                }
            }
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ScheduleController],
            providers: [
                ScheduleService,
                {
                    provide: SCHEDULE_REPOSITORY_TOKEN,
                    useClass: Repository,
                },
                {
                    provide: PaginationService,
                    useValue: mockPage
                },
                {
                    provide: CacheService,
                    useValue: mockCache
                }
            ],
        }).compile();

        scheduleController = module.get<ScheduleController>(ScheduleController);
        scheduleService = module.get<ScheduleService>(ScheduleService);
        pageService = module.get<PaginationService>(PaginationService)
        cacheService = module.get<CacheService>(CacheService);
        scheduleRepository = module.get<Repository<Schedule>>(getRepositoryToken(Schedule));
    });

    it('should be defined', () => {
        expect(scheduleController).toBeDefined();
    });

    describe('findAll', () => {
        const schedule1 = new Schedule();
            schedule1.id = '58d45c93-85d6-4fd9-bbe4-a23eaf9e13d7'
            schedule1.accountId = 1
            schedule1.agentId = 1
            schedule1.startTime = new Date()
            schedule1.endTime = new Date()

            const schedule2 = new Schedule()
            schedule2.id = '58d45c93-85d6-4fd9-bbe4-a23eaf9e13l8'
            schedule2.accountId = 1
            schedule2.agentId = 1
            schedule2.startTime = new Date()
            schedule2.endTime = new Date()

        it('should return an array of schedules', async () => {
            const schedules = [schedule1, schedule2];
            const schedulesWithPage = pageService.withPage(schedules)
            jest.spyOn(scheduleService, 'findAll').mockReturnValue(schedulesWithPage);

            const result = await scheduleController.findAll();
            expect(result).toEqual(schedulesWithPage);
        });

        it('should throw an exception when an error occurs', async () => {
            const createScheduleDTO: CreateScheduleDTO = {
                accountId: 2,
                agentId: 1,
                startTime: new Date("2026-10-24T13:00:00.000Z"),
                endTime: new Date("2027-01-23T13:00:00.000Z")
            };
            
            const error = new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            jest.spyOn(scheduleService, 'create').mockRejectedValue(error);
      
            try {
              await scheduleController.create(createScheduleDTO);
            } catch (e) {
              expect(e).toBeInstanceOf(HttpException);
              expect(e.response).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
              expect(e.status).toBe("Internal Server Error");
            }
          });

    })
});
