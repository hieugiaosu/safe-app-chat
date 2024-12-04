import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';



@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sendMessage')
  async sendMessage(
    @Body('conversationId') conversationId: string,
    @Body('senderId') senderId: string,
    @Body('text') text: string,
  ) {
    return this.chatService.sendMessage(conversationId, senderId, text);
  }

  @Post('sendFirstMessage')
  async sendFirstMessage(
    @Body('recipientId') recipientId: string,
    @Body('senderId') senderId: string,
    @Body('text') text: string,
  ) {
    return this.chatService.sendFirstMessage(senderId, recipientId, text);
  }

  @Get('getConversation')
  async getConversation(
    @Query('user1Id') user1Id: string,
    @Query('user2Id') user2Id: string,
  ) {
    return this.chatService.getConversation(user1Id, user2Id);
  }

  @Get('getAllConversationByUser')
  async getAllConversationByUser(
    @Query('userId') userId: string,
  ) {
    return this.chatService.getAllConversationByUser(userId);
  }
}
