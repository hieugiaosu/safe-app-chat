import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { generateUser } from '../../__mock__/user.data';
import { UserMapperProfile } from '../user/mapper/user.mapper-profile';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/payload.dto';

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AutomapperModule.forRoot({
                    strategyInitializer: classes(),
                }),
                JwtModule.register({
                    global: true,
                    secret: "secretKey",
                    signOptions: { expiresIn: '3600s' },
                }),
            ],
            providers: [
                AuthService,
                {
                    provide: UserRepository,
                    useValue: {
                        findByEmail: jest.fn(),
                    },
                },
                UserMapperProfile
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('signIn', () => {
        it('should throw BadRequestException if email is incorrect', async () => {
            const email = 'test@gmail.com';
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

            const payload: SignInDto = { email, password: '123456' };
            await expect(
                authService.signIn(payload),
            ).rejects.toThrowError(new BadRequestException("Email or password is incorrect"));
        });
        it('should throw BadRequestException if password is incorrect', async () => {
            const email = 'john.doe@example.com';
            const user = generateUser({});
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

            const payload: SignInDto = { email, password: '123456' };
            await expect(
                authService.signIn(payload),
            ).rejects.toThrowError(new BadRequestException("Password is incorrect"));
        });
    });
});
