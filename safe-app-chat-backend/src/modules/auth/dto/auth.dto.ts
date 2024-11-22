import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/modules/user/dto/user.dto";

export class AuthInfoDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        description: 'access token',
    })
    accessToken: string;

    @ApiProperty({
        type: UserDto,
        description: 'user',
    })
    user: UserDto;
}