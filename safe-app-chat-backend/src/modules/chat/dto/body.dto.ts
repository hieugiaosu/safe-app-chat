import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMessageBodyDto {
    @ApiProperty()
    @IsString()
    conversationId: string;

    @ApiProperty()
    @IsString()
    messageContent: string;
}
