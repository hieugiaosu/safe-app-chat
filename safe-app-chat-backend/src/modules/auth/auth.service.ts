import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { User } from '../user/user.schema';
import { UserDto } from '../user/dto/user.dto';
import { AuthInfoDto } from './dto/auth.dto';
import { SignInDto, SignUpDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,

        @InjectMapper()
        private mapper: Mapper,
    ) { }

    async signIn(payload: SignInDto): Promise<AuthInfoDto> {
        const userDoc = await this.userRepository.findByEmail(payload.email);
        if (!userDoc) {
            throw new BadRequestException("Email or password is incorrect");
        }
        const isPasswordValid = await bcrypt.compare(payload.password, userDoc.password);
        if (!isPasswordValid) {
            throw new BadRequestException("Password is incorrect");
        }
        const jwtPayload: AuthUserInfo = { sub: userDoc._id };
        const mappedUser = this.mapper.map(userDoc, User, UserDto);
        return {
            accessToken: await this.jwtService.signAsync(jwtPayload),
            user: mappedUser,
        };
    }

    async signUp(payload: SignUpDto): Promise<UserDto> {
        const { email, password } = payload
        const existingUserDoc = await this.userRepository.findByEmail(email);
        if (existingUserDoc) {
            throw new BadRequestException("User already exists");
        }

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);

        const userDoc = await this.userRepository.create({
            ...payload,
            password: hash,
        });
        const mappedUser = this.mapper.map(userDoc, User, UserDto);
        return mappedUser;
    }
}
