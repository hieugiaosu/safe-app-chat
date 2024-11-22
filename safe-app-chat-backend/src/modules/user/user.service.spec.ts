import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { NotFoundException } from '@nestjs/common';
import { generateUser } from '../../__mock__/user.data';
import { UserMapperProfile } from './mapper/user.mapper-profile';
import { UserDto } from './dto/user.dto';
import { Types } from 'mongoose';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AutomapperModule.forRoot({
                    strategyInitializer: classes(),
                }),
            ],
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
                UserMapperProfile
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('findUserById', () => {
        it('should throw NotFoundException if user does not found', async () => {
            const userId = '66f19519cdebdcac0f19c944';
            jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
            await expect(
                userService.findUserById(new Types.ObjectId(userId)),
            ).rejects.toThrowError(new NotFoundException("User not found"));
        });
        it('should return if user was found', async () => {
            const userId = '66f19519cdebdcac0f19c944';
            const user = generateUser({ id: userId });
            const expectedResult: UserDto = {
                _id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
            const result = await userService.findUserById(new Types.ObjectId(userId));
            await expect(result).toEqual(expectedResult);
        });
    });
});
