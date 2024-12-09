import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ConversationDto {
    @ApiProperty()
    @AutoMap()
    _id: string;

    @ApiProperty({ type: [String], description: 'Array of user IDs' })
    @AutoMap()
    members: string[];

    @ApiProperty()
    @AutoMap()
    @IsOptional()
    @IsString()
    lastMessage?: string;

    @ApiProperty()
    @AutoMap()
    @IsOptional()
    @IsString()
    lastSenderId?: string;

    @ApiProperty()
    @AutoMap()
    createdAt: Date;

    @ApiProperty()
    @AutoMap()
    updatedAt: Date;
}