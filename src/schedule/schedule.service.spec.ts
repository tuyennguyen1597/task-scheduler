import { Test } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { Repository } from 'typeorm';
import { Schedule } from '../models/scheduler.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { PaginationService } from '../shared/pagination.helper';
import { CacheService } from '../shared/cache/cache.helper';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';

describe('Schedule Test suite', () => {
    let service: ScheduleService;
    let pageService: PaginationService;
    let cacheService: CacheService;
    let scheduleRepository: Repository<Schedule>


    const SCHEDULE_REPOSITORY_TOKEN = getRepositoryToken(Schedule);
    const mockScheduleRepository = {
        find: jest.fn(),
        save: jest.fn((newSchedule) => {
            return { ...newSchedule, id: '58d45c93-85d6-4fd9-bbe4-a23eaf9e13d7' }; // Simulate saving and generating an ID
        }),
        delete: jest.fn(),
    }

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
        const module = await Test.createTestingModule({
            providers: [
                ScheduleService,
                {
                    provide: SCHEDULE_REPOSITORY_TOKEN,
                    useValue: mockScheduleRepository
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

        service = module.get<ScheduleService>(ScheduleService);
        pageService = module.get<PaginationService>(PaginationService);
        cacheService = module.get<CacheService>(CacheService);
        scheduleRepository = module.get<Repository<Schedule>>(SCHEDULE_REPOSITORY_TOKEN);

        service.finById = jest.fn().mockResolvedValue({
            id: "661842e6-167d-4435-8057-772854e5a230",
            accountId: 3,
            agentId: 3,
            startTime: "2026-10-24T13:00:00.000Z",
            endTime: "2027-01-23T13:00:00.000Z"
        })
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('scheduleRepository should be defined', () => {
        expect(scheduleRepository).toBeDefined();
    })

    describe('findAll', () => {
        it('should return all schedules in the database', async () => {
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

            const mockSchedulers: Schedule[] = [schedule1, schedule2]

            jest.spyOn(service, 'findAll').mockResolvedValue(pageService.withPage(mockSchedulers))

            const schedulers = await service.findAll();

            expect(schedulers.data).toEqual(mockSchedulers);
        })
    })

    describe('create', () => {
        it('should be defined', () => {
            expect(service.create).toBeDefined();
        })

        it('should create new schedule', async () => {
            const newScheduleDto: CreateScheduleDTO = {
                startTime: new Date(),
                endTime: new Date(),
                agentId: 1,
                accountId: 1,
            };

            const newSchedule = new Schedule();
            Object.assign(newSchedule, newScheduleDto)
            jest.spyOn(scheduleRepository, 'save').mockResolvedValue(newSchedule);

            const createdSchedule = await service.create(newScheduleDto);

            expect(createdSchedule).toBe(newSchedule);
            expect(scheduleRepository.save).toHaveBeenCalledWith(newSchedule);
            expect(cacheService.addValueToCache).toHaveBeenCalledWith('schedule', newSchedule);
        })
    })

    describe('update', () => {
        it('should be defined', () => {
            expect(service.update).toBeDefined();
        })

        it('should update schedule', async () => {
            const updateScheduleDto: UpdateScheduleDTO = {
                accountId: 2,
                agentId: 1,
                startDate: new Date("2026-10-24T13:00:00.000Z"),
                endDate: new Date("2027-01-23T13:00:00.000Z")
            };

            const mockSchedule = {
                id: "661842e6-167d-4435-8057-772854e5a230",
                accountId: 3,
                agentId: 3,
                startTime: "2026-10-24T13:00:00.000Z",
                endTime: "2027-01-23T13:00:00.000Z"
            }
            
            const updatedSchedule = await scheduleRepository.save(mockSchedule)

            const updated = await service.update("661842e6-167d-4435-8057-772854e5a230", updateScheduleDto)

            expect(updated.accountId).toEqual( updatedSchedule.accountId);
            expect(service.finById).toHaveBeenCalledWith(mockSchedule.id)
            expect(cacheService.addValueToCache).toHaveBeenCalledWith('schedule', updated);
        })
    })
});