import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ collection: 'conversation', timestamps: true })
export class Conversation {
  @AutoMap()
  _id: Types.ObjectId;

  @AutoMap()
  @Prop({ required: true })
  members: string[]; // List of user IDs in the conversation

  @AutoMap()
  @Prop()
  lastMessage: string; // Optionally store the last message content

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
