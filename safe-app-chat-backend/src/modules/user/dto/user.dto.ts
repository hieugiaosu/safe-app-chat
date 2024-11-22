import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    @AutoMap()
    _id: string;

    @ApiProperty()
    @AutoMap()
    firstName: string;

    @ApiProperty()
    @AutoMap()
    lastName: string;

    @ApiProperty()
    @AutoMap()
    email: string;

    @ApiProperty()
    @AutoMap()
    createdAt: Date;

    @ApiProperty()
    @AutoMap()
    updatedAt: Date;
}