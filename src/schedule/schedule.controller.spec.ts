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
import { UpdateScheduleDTO } from './dto/update-schedule.dto';

describe('ScheduleController', () => {
    const SCHEDULE = 'schedule'
    const id = '58d45c93-85d6-4fd9-bbe4-a23eaf9e13d7'
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

    const mockScheduleRepository = {
        find: jest.fn(),
        save: jest.fn((newSchedule) => {
            return { ...newSchedule, id };
        }),
        delete: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ScheduleController],
            providers: [
                ScheduleService,
                {
                    provide: SCHEDULE_REPOSITORY_TOKEN,
                    useValue: mockScheduleRepository,
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
        scheduleService.finById = jest.fn(async (id) => {
            const filteredSchedules = schedules.filter(schedule => schedule.id === id)
            if (filteredSchedules && filteredSchedules.length) return filteredSchedules[0]
        })
    });

    it('should be defined', () => {
        expect(scheduleController).toBeDefined();
    });

    const schedule1 = new Schedule();
    schedule1.id = id
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

    const schedules = [schedule1, schedule2];

    describe('findAll', () => {

        it('should return an array of schedules', async () => {

            const schedulesWithPage = pageService.withPage(schedules)
            jest.spyOn(scheduleService, 'findAll').mockReturnValue(schedulesWithPage);

            const result = await scheduleController.findAll();
            expect(result).toEqual(schedulesWithPage);
        });

    })

    describe('create', () => {
        let createScheduleDTO = new CreateScheduleDTO();
        createScheduleDTO.accountId = 1

        it('should create schedule', async () => {
            const newSchedule = new Schedule()
            Object.assign(newSchedule, createScheduleDTO)
            const result = await scheduleController.create(createScheduleDTO)
            const createdSchedule = scheduleRepository.save(newSchedule)

            expect(cacheService.addValueToCache).toHaveBeenCalledWith(SCHEDULE, createdSchedule)
            expect(result).toEqual(createdSchedule)
        })

        it('should throw an exception when an error occurs', async () => {
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

    describe('update', () => {
        let updateScheduleDTO = new UpdateScheduleDTO();
        updateScheduleDTO.accountId = 2

        it('should be defined', () => {
            expect(scheduleController.update).toBeDefined()
        })

        it('should update schedule', async () => {
            const result = await scheduleController.update(id, updateScheduleDTO)

            const schedule = schedules.filter(schedule => schedule.id === id)[0];
            const updatedSchedule = scheduleRepository.save(schedule)

            expect(cacheService.addValueToCache).toHaveBeenCalledWith(SCHEDULE, updatedSchedule)
            expect(result).toEqual(updatedSchedule)
        })
    })

    describe('delete', () => {
        it('should be defined', () => {
            expect(scheduleController.delete).toBeDefined()
        })
    })
});
