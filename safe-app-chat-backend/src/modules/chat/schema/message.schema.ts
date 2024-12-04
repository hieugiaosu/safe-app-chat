import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ collection: 'message', timestamps: true })
export class Message {
  @AutoMap()
  _id: Types.ObjectId;

  @AutoMap()
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId; // Link to the conversation

  @AutoMap()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId; // ID of the message sender

  @AutoMap()
  @Prop({ required: true })
  text: string; // The message content

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
