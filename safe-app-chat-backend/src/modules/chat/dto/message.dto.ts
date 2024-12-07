import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ description: 'The unique identifier of the message' })
  @AutoMap()
  _id: string; // Use string as the type since ObjectId will be serialized as a string

  @ApiProperty({ description: 'The ID of the conversation this message belongs to' })
  @AutoMap()
  conversationId: string; // Reference to the Conversation ID

  @ApiProperty({ description: 'The ID of the user who sent the message' })
  @AutoMap()
  senderId: string; // Reference to the User ID

  @ApiProperty({ description: 'The content of the message' })
  @AutoMap()
  text: string; // The message content

  @ApiProperty({ description: 'The timestamp when the message was created' })
  @AutoMap()
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the message was last updated' })
  @AutoMap()
  updatedAt: Date;
}