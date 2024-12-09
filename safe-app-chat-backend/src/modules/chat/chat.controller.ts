import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ChatService } from './chat.service';
import { CreateMessageBodyDto } from './dto/body.dto';

class CreateConversationDto {
  recipientId: string;
}

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async sendMessage(
    @Body() body: CreateMessageBodyDto,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as AuthUserInfo;
    return this.chatService.sendMessage(body, user.sub);
  }

  @Post('conversations')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Start a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async createConversation(
    @Body() body: CreateConversationDto,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as AuthUserInfo;
    return this.chatService.startConversation(user.sub.toString(), body.recipientId);
  }

  @Get('conversations/user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all conversations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully.' })
  async getAllConversationsByUser(@Request() req: ExpressRequest) {
    const userId = req.user.sub;
    return this.chatService.getAllConversationByUser(userId);
  }

  @Get('conversations/with-user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a conversation with a specific user' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Conversation not found.' })
  async getConversation(
    @Query('withUserId') user2Id: string,
    @Request() req: ExpressRequest,
  ) {
    const user1Id = req.user.sub.toString();
    return this.chatService.getConversation(user1Id, user2Id);
  }

  @Get('conversations/detail/:conversationId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get conversation details by ID' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Conversation not found.' })
  async getConversationById(@Param('conversationId') chatId: string) {
    return this.chatService.getConversationById(chatId);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get all messages in a conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Conversation not found.' })
  async getAllMessagesByConversationId(@Query('conversationId') chatId: string) {
    return this.chatService.getAllMessagesByConversationId(chatId);
  }
}
