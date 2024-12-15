import { Controller, Get, Put, HttpCode, HttpStatus, Query, Param, Body, Request, UseGuards, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../user/dto/user.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get user me',
        description: 'Get user me',
    })
    @ApiResponse({
        status: 200,
        description: 'Get user me successfully',
        type: UserDto
    })
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/me')
    getUserMe(@Request() req: ExpressRequest) {
        const user = req.user as AuthUserInfo;
        return this.adminService.findUserById(user.sub);
    }

    @Get('getUserByEmail')
    async getConversation(
        @Query('email') email: string,
    ) {
        return this.adminService.getUserByEmail(email);
    }
    @Get('users')
    async getAllUsers() {
        console.log('getAllUsers được gọi:');
        return this.adminService.findAllUsers();
    }

    @Put(':id/updateRole')
        @UseGuards(AuthGuard) 
        async updateUserRoleById(
            @Param('id') userId: string, 
            @Body('role') role: string
        ) {
            console.log('updateRole được gọi');
            return this.adminService.updateUserRoleById(userId, role);
        }
       
        @Put(':id/updateStatus')
        @UseGuards(AuthGuard) // Bảo vệ bằng AuthGuard nếu cần
        async updateUserStatusById(
            @Param('id') userId: string, // Lấy userId từ URL
            @Body('isActive') isActive: boolean
        ) {
            console.log('updateStatus được gọi');
            return this.adminService.updateUserStatusById(userId, isActive);
        }
}
