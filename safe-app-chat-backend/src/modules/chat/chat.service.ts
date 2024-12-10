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

@Injectable()
export class ChatService {
  constructor(
    @Inject('IConversationRepository') private readonly conversationRepository: IConversationRepository,
    @Inject('IMessageRepository') private readonly messageRepository: IMessageRepository,
    private readonly firebaseService: FirebaseService,

    @InjectConnection() private connection: Connection,
    @InjectMapper()
    private mapper: Mapper,
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
    if (!conversation.members.includes(new Types.ObjectId(userId))) {
      throw new NotFoundException('Conversation not found ');
    }

    let message: Message;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      message = await this.messageRepository.create({
        conversationId: new Types.ObjectId(conversationId),
        senderId: new Types.ObjectId(userId),
        text: messageContent,
      }, session);
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
    }

    await this.firebaseService.set(
      `conversations/${conversationId}/messages/${message._id}`,
      {
        senderId: message.senderId.toString(),
        text: message.text,
        timestamp: message.createdAt,
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
      { members: new Types.ObjectId(userId) }
    );
    return conversations.map((conversation) => {
      return {
        _id: conversation._id.toString(),
        members: conversation.members.map((member) => member.toString()),
        lastMessage: conversation.lastMessage,
        lastSenderId: conversation.lastSenderId?.toString() || null,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      }
    });
  }

  async getAllMessagesByConversationId(conversationId: string): Promise<MessageDto[]> {
    if (!isValidObjectId(conversationId)) {
      throw new BadRequestException('Invalid conversation ID');
    }
    
    const messages = await this.messageRepository.getByConditions(
      { conversationId: new Types.ObjectId(conversationId) },
      { sort: { createdAt: 1 } }
    )
    return messages.map((message) => {
      return {
        _id: message._id.toString(),
        conversationId: message.conversationId.toString(),
        senderId: message.senderId?.toString() || null,
        text: message.text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      }
    });
  }
}
