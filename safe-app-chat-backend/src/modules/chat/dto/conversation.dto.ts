import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/modules/user/dto/user.dto";

export class ConversationDto {
    @ApiProperty()
    @AutoMap()
    _id: string;

    @ApiProperty({ type: [String], description: 'Array of user IDs' })
    @AutoMap()
    members: string[];

    @ApiProperty()
    @AutoMap()
    lastMessage: string;

    @ApiProperty()
    @AutoMap()
    createdAt: Date;

    @ApiProperty()
    @AutoMap()
    updatedAt: Date;
}