import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';
import { UserDto } from '../user/dto/user.dto';
@Injectable()
export class AdminService {
    constructor(
        private adminRepo: AdminRepository,

        @InjectMapper()
        private mapper: Mapper,
    ) { }

    async findUserById(_id: Types.ObjectId): Promise<UserDto> {
        const userDoc = await this.adminRepo.findById(_id);
        if (!userDoc) {
            throw new NotFoundException('User not found');
        }
        const mappedUser = this.mapper.map(userDoc, User, UserDto);
        return mappedUser;
    }

    async getUserByEmail(email: string) {
        const userDoc = await this.adminRepo.findByEmail(email);

        if (!userDoc) {
            throw new NotFoundException('User not found');
        }
        const mappedUser = this.mapper.map(userDoc, User, UserDto);
        return mappedUser;
    }

    async findAllUsers(): Promise<UserDto[]> {
        // Find all users using UserRepository
        const userDocs = await this.adminRepo.findAll();
    
        // Check if any users were found
        if (!userDocs || userDocs.length === 0) {
          throw new NotFoundException('No users found');
        }
    
        // Map User documents to UserDto objects
        const mappedUsers = userDocs.map((userDoc) => this.mapper.map(userDoc, User, UserDto));
    
        return mappedUsers.map(user => new UserDto(user));
      }
    
      async updateUserStatusById(userId: string, isActive: boolean): Promise<UserDto> {
       
        const updatedUser = await this.adminRepo.updateUserIsActive(userId, isActive);
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        // Map the updated user to a Dto (if needed)
        const mappedUser = this.mapper.map(updatedUser, User, UserDto);
        return mappedUser;
      }

      async sendWarning(userId: string): Promise<void> {
        // Logic to send a warning
        console.log(`Warning sent to user: ${userId}`);
      }
      async updateUserRoleById(userId: string, newRole: string): Promise<UserDto> {
       
        const updatedUser = await this.adminRepo.updateUserRole(userId, newRole);
        if (!updatedUser) {
          throw new NotFoundException('Failed to update user role');
        }
    
        return this.mapper.map(updatedUser, User, UserDto);
      }
}
