import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schema/message.schema';
import { Conversation } from './schema/conversation.schema';
import * as admin from 'firebase-admin';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {}

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    // Save to MongoDB
    const message = new this.messageModel({ conversationId, senderId, text });
    const savedMessage = await message.save();

    // Update Conversation's last message
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: { text, senderId, timestamp: new Date() },
    });

    // Push to Firebase Realtime Database
    const firebaseRef = admin.database().ref(`conversations/${conversationId}/messages`);
    await firebaseRef.push({
      senderId,
      text,
      timestamp: savedMessage.createdAt,
    });

    return savedMessage;
  }

  async sendFirstMessage(senderId: string, recipientId: string, text: string): Promise<Message> {
    console.log(text);
    
    // Step 1: Check if a conversation already exists between the two users
    let conversation = await this.conversationModel.findOne({
      members: { $all: [senderId, recipientId] },
    });
  
    // Step 2: If no conversation exists, create a new one
    if (!conversation) {
      conversation = new this.conversationModel({
        members: [senderId, recipientId],
        lastMessage: text,
      });
      await conversation.save();
    }
  
    // Step 3: Save the message to MongoDB
    const message = new this.messageModel({
      conversationId: conversation._id,
      senderId: senderId,
      text,
    });
    const savedMessage = await message.save();
  
    // Step 4: Update the conversation's last message
    conversation.lastMessage = text;
    await conversation.save();
  
    // Step 5: Push the message to Firebase Realtime Database
  
    return savedMessage;
  }

  async getConversation(user1Id: string, user2Id: string) {
    const conversation = await this.conversationModel.findOne({
      members: { $all: [user1Id, user2Id] },
    });
    return conversation || []; // Return an empty array if no data is found
  }
  
  async getAllConversationByUser(userId: string) {
    const conversations = await this.conversationModel.find({
      members: userId, // Adjusted to find all conversations that include this user
    });
    return conversations.length > 0 ? conversations : []; // Return an empty array if no data is found
  }

  async getAllMessagesByChatId(chatId: string) {
    console.log(chatId);
    
    const messages = await this.messageModel.find({
      conversationId: chatId
    })
    console.log(messages);
    
    return messages.length > 0 ? messages : []
  }
}
