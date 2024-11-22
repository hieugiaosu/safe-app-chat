import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthInfoDto } from './dto/auth.dto';
import { SignInDto, SignUpDto } from './dto/payload.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({
        summary: 'Login',
        description: 'Login with email and password',
    })
    @ApiResponse({
        status: 200,
        description: 'Login successfully',
        type: AuthInfoDto
    })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() payload: SignInDto) {
        return this.authService.signIn(payload);
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    signUp(@Body() payload: SignUpDto) {
        return this.authService.signUp(payload);
    }
}
