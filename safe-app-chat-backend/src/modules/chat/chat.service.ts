import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, isValidObjectId, Types } from 'mongoose';
import { FirebaseService } from '../firebase/firebase.service';
import { IConversationRepository, IMessageRepository } from './chat.interface';
import { CreateMessageBodyDto } from './dto/body.dto';
import { ConversationDto } from './dto/conversation.dto';
import { MessageDto } from './dto/message.dto';
import { Message } from './schema/message.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
@Injectable()
export class ChatService {
  private readonly apiKey = process.env.AI_SERVICE_API_KEY;
  private readonly apiEndpoint = process.env.AI_SERVICE_ENDPOINT;

  constructor(
    @Inject('IConversationRepository') private readonly conversationRepository: IConversationRepository,
    @Inject('IMessageRepository') private readonly messageRepository: IMessageRepository,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    @InjectConnection() private connection: Connection,
    @InjectMapper()
    private mapper: Mapper,
    private readonly httpService: HttpService
  ) {}

  async sendMessage(body: CreateMessageBodyDto, userId: Types.ObjectId): Promise<MessageDto> {
    const { conversationId, messageContent } = body;
    if (!isValidObjectId(conversationId)) {
      throw new BadRequestException('Invalid conversation ID');
    }
    if (!messageContent) {
      throw new BadRequestException('Message content is required');
    }
    const conversation = await this.conversationRepository.findById(new Types.ObjectId(conversationId));
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (!conversation.members.map(member => member.toString()).includes(userId.toString())) {
      throw new NotFoundException('Conversation not found');
    }

    // check toxicity
    const toxicRes = await lastValueFrom(
        this.httpService.post(
          `${this.apiEndpoint}/message-classifier/toxic-classify`,
          { message: messageContent},
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          },
        ),
      );
    let message: Message;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      console.log(toxicRes.data.toxic);
      message = await this.messageRepository.create({
        isToxic: toxicRes.data.toxic,
        conversationId: new Types.ObjectId(conversationId),
        senderId: new Types.ObjectId(userId),
        text: messageContent,
        
      }, session);
      console.log(message);
      
      await this.conversationRepository.findAndUpdate(
        { _id: new Types.ObjectId(conversationId) },
        { lastMessage: messageContent, lastSenderId: new Types.ObjectId(userId) },
        {session},
      )
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException('Failed to send message');
    } finally {
      session.endSession();
    }

    // Save to MongoDB
    // const message = new this.messageModel({ conversationId, senderId, text });
    const messageDto: MessageDto = {
      _id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: message.senderId.toString(),
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isToxic: message.isToxic
    }
    console.log('co ko', message.createdAt);
    
    await this.firebaseService.set(
      `conversations/${conversationId}/messages/${message._id}`,
      {
        senderId: message.senderId.toString(),
        text: message.text,
        timestamp: Date.now(),
        isToxic: message.isToxic
      }
    )
    return messageDto;
  }

  async startConversation(user1Id: string, user2Id: string): Promise<ConversationDto> {
    if (!isValidObjectId(user1Id) || !isValidObjectId(user2Id)) {
      throw new BadRequestException('Invalid user ID');
    }
    if (user1Id === user2Id) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }


    let conversation: ConversationDto;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const existingConversation = await this.conversationRepository.findByConditions(
        { members: { $all: [new Types.ObjectId(user1Id), new Types.ObjectId(user2Id)].sort() }},
      );
      if (existingConversation) {
        conversation = {
          _id: existingConversation._id.toString(),
          members: existingConversation.members.map((member) => member.toString()),
          lastMessage: existingConversation.lastMessage,
          lastSenderId: existingConversation.lastSenderId?.toString()|| null,
          createdAt: existingConversation.createdAt,
          updatedAt: existingConversation.updatedAt,
        }
      } else {
        const newConversation = await this.conversationRepository.create({
          members: [new Types.ObjectId(user1Id), new Types.ObjectId(user2Id)].sort(),
        }, session);
        conversation = {
          _id: newConversation._id.toString(),
          members: newConversation.members.map((member) => member.toString()),
          lastMessage: newConversation.lastMessage,
          lastSenderId: newConversation.lastSenderId?.toString() || null,
          createdAt: newConversation.createdAt,
          updatedAt: newConversation.updatedAt,
        }
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException('Failed to start conversation');
    } finally {
      session.endSession();
    }
    return conversation;
  }

  async getConversation(user1Id: string, user2Id: string): Promise<ConversationDto|null> {
    if (!isValidObjectId(user1Id) || !isValidObjectId(user2Id)) {
      throw new BadRequestException('Invalid user ID');
    }
    const conversation = await this.conversationRepository.findByConditions(
      { members: { $all: [new Types.ObjectId(user1Id), new Types.ObjectId(user2Id)].sort() }},
    );
    if (!conversation) {
      return null;
    }
    return {
      _id: conversation._id.toString(),
      members: conversation.members.map((member) => member.toString()),
      lastMessage: conversation.lastMessage,
      lastSenderId: conversation.lastSenderId?.toString() || null,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    }
  }

  async getConversationById(conversationId: string): Promise<ConversationDto|null> {
    if (!isValidObjectId(conversationId)) {
      throw new BadRequestException('Invalid conversation ID');
    }
    const conversation = await this.conversationRepository.findById(new Types.ObjectId(conversationId));
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return {
      _id: conversation._id.toString(),
      members: conversation.members.map((member) => member.toString()),
      lastMessage: conversation.lastMessage,
      lastSenderId: conversation.lastSenderId?.toString() || null,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
  
  async getAllConversationByUser(userId: Types.ObjectId): Promise<ConversationDto[]> {
    const conversations = await this.conversationRepository.getByConditions(
      { members: new Types.ObjectId(userId) },
    );

    const conversationDtos = [];
    for (const conversation of conversations) {
      const membersWithDetails = await Promise.all(
        conversation.members.map(async (memberId) => {
          const user = await this.userService.findUserById(memberId);
          return {
            id: memberId.toString(),
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown',
          };
        }),
      );

      conversationDtos.push({
        _id: conversation._id.toString(),
        members: membersWithDetails,
        lastMessage: conversation.lastMessage,
        lastSenderId: conversation.lastSenderId?.toString() || null,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      });
    }

    return conversationDtos;
  }

  async getAllMessagesByConversationId(conversationId: string): Promise<MessageDto[]> {
    if (!isValidObjectId(conversationId)) {
      throw new BadRequestException('Invalid conversation ID');
    }
    
    const messages = await this.messageRepository.getByConditions(
      { conversationId: new Types.ObjectId(conversationId) },
      { sort: { createdAt: 1 } }
    )
    console.log(messages);
    
    return messages.map((message) => {
      return {
        _id: message._id.toString(),
        conversationId: message.conversationId.toString(),
        senderId: message.senderId?.toString() || null,
        text: message.text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        isToxic: message.isToxic
      }
    });
  }
}
