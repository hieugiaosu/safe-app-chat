import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from '../firebase/firebase.module';
import { ChatController } from './chat.controller';
import { ConversationRepository, MessageRepository } from './chat.repository';
import { ChatService } from './chat.service';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { Message, MessageSchema } from './schema/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    FirebaseModule
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    {
      provide: 'IConversationRepository',
      useClass: ConversationRepository,
    },
    {
      provide: 'IMessageRepository',
      useClass: MessageRepository,
    }
  ],
})
export class ChatModule {}
