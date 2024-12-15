import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { NotFoundException } from '@nestjs/common';
import { generateUser } from '../../__mock__/user.data';
import { UserMapperProfile } from '../user/mapper/user.mapper-profile';
import { UserDto } from '../user/dto/user.dto';
import { Types } from 'mongoose';

describe('AdminService', () => {
    let adminService: AdminService;
    let adminRepository: AdminRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AutomapperModule.forRoot({
                    strategyInitializer: classes(),
                }),
            ],
            providers: [
                AdminService,
                {
                    provide: AdminRepository,
                    useValue: {
                        findById: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
                UserMapperProfile,
            ],
        }).compile();

        adminService = module.get<AdminService>(AdminService);
        adminRepository = module.get<AdminRepository>(AdminRepository);
    });

    it('should be defined', () => {
        expect(adminService).toBeDefined();
        expect(adminRepository).toBeDefined();
    });

    describe('findUserById', () => {
        it('should throw NotFoundException if user is not found', async () => {
            const userId = '66f19519cdebdcac0f19c944';
            jest.spyOn(adminRepository, 'findById').mockResolvedValue(null);

            await expect(
                adminService.findUserById(new Types.ObjectId(userId)),
            ).rejects.toThrowError(new NotFoundException('User not found'));
        });

        it('should return UserDto if user is found', async () => {
            const userId = '66f19519cdebdcac0f19c944';
            const user = generateUser({ id: userId });

            const expectedResult: UserDto = {
                _id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role,
                isActive: user.isActive,
            };

            jest.spyOn(adminRepository, 'findById').mockResolvedValue(user);

            const result = await adminService.findUserById(new Types.ObjectId(userId));
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAllUsers', () => {
        it('should throw NotFoundException if no users are found', async () => {
            jest.spyOn(adminRepository, 'findAll').mockResolvedValue([]);

            await expect(adminService.findAllUsers()).rejects.toThrowError(
                new NotFoundException('No users found'),
            );
        });

        it('should return an array of UserDto if users are found', async () => {
            const users = [
                generateUser({ id: '66f19519cdebdcac0f19c944' }),
                generateUser({ id: '77f19519cdebdcac0f19c955' }),
            ];

            const expectedResult: UserDto[] = users.map(user => ({
                _id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role,
                isActive: user.isActive,
            }));

            jest.spyOn(adminRepository, 'findAll').mockResolvedValue(users);

            const result = await adminService.findAllUsers();
            expect(result).toEqual(expectedResult);
        });
    });
});