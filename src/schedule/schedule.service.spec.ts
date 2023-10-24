import { Test } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { Repository } from 'typeorm';
import { Schedule } from '../models/scheduler.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { PaginationService } from 'src/shared/pagination.helper';
import { CacheService } from 'src/shared/cache/cache.helper';
import { PageDTO } from 'src/common/dto/page.dto';

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

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ScheduleService,
                {
                    provide: SCHEDULE_REPOSITORY_TOKEN,
                    useValue: mockScheduleRepository
                },
                PaginationService,
                CacheService
            ],
        }).compile();

        service = module.get<ScheduleService>(ScheduleService);
        pageService = module.get<PaginationService>(PaginationService);
        cacheService = module.get<CacheService>(CacheService);
        scheduleRepository = module.get<Repository<Schedule>>(SCHEDULE_REPOSITORY_TOKEN);
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
            const mockSchedulersWithPage: PageDTO<Schedule> = {
                data: mockSchedulers,
                meta: {
                    page: 1,
                    take: 2,
                    itemCount: 2,
                    pageCount: 1,
                    hasPreviousPage: false,
                    hasNextPage: false
                }
            }

            jest.spyOn(service, 'findAll').mockResolvedValue(mockSchedulersWithPage)

            const schedulers = await service.findAll();

            expect(schedulers).toEqual(mockSchedulersWithPage)
        })
    })

    describe('create', () => {
        it('should be defined', () => {
            expect(service.create).toBeDefined();
        })

        it('should create new schedule', async () => {
            const newSchedule: CreateScheduleDTO = {
                startTime: new Date(),
                endTime: new Date(),
                agentId: 1,
                accountId: 1,
            };

            const createdSchedule = await service.create(newSchedule);
            expect(createdSchedule.agentId).toBe(1);
        })
    })
});