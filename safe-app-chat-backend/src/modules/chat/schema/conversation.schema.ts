import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ collection: 'conversation', timestamps: true })
export class Conversation {
  @AutoMap()
  _id: Types.ObjectId;

  @AutoMap()
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  members: Types.ObjectId[]; // List of user IDs in the conversation

  @AutoMap()
  @Prop({ required: false, default: null })
  lastMessage?: string; // Optionally store the last message content

  @AutoMap()
  @Prop({ type: Types.ObjectId, ref: 'user' })
  lastSenderId: Types.ObjectId; // Optionally store the last message sender ID

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
