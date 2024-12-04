import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { User } from './user.schema';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        private userRepo: UserRepository,

        @InjectMapper()
        private mapper: Mapper,
    ) { }

    async findUserById(id: Types.ObjectId): Promise<UserDto> {
        const userDoc = await this.userRepo.findById(id);
        if (!userDoc) {
            throw new NotFoundException('User not found');
        }
        const mappedUser = this.mapper.map(userDoc, User, UserDto);
        return mappedUser;
    }

    async getUserByEmail(email: string) {
        return this.userRepo.findByEmail(email);
    }
}
