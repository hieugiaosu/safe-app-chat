import { Controller, Get, HttpCode, HttpStatus, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

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
        return this.userService.findUserById(user.sub);
    }

    @ApiOperation({
        summary: 'Get user by email',
        description: 'Get user by email',
    })
    @ApiResponse({
        status: 200,
        description: 'Get user by email successfully',
        type: UserDto
    })
    @Get('getUserByEmail')
    async getConversation(
        @Query('email') email: string,
    ) {
        return this.userService.getUserByEmail(email);
    }
}
