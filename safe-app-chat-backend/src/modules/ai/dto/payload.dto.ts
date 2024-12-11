import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from '../../../utils/validator';

export class SignInDto {
    @ApiProperty({
        example: 'example@gmail.com',
        description: 'email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'T@123456',
        description: 'password include 8 characters, 1 number, 1 uppercase, 1 lowercase, 1 special character',
    })
    @IsNotEmpty()
    password: string;
}

export class SignUpDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword({
        message:
            'New password must be a strong password, include uppercase, lowercase, number, special character and minimum 8 characters',
    })
    password: string;
}