import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import { IConversationRepository, IMessageRepository } from "./chat.interface";
import { Conversation } from "./schema/conversation.schema";
import { Message } from "./schema/message.schema";

@Injectable()
export class MessageRepository extends BaseRepository<Message> implements IMessageRepository {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>
    ) {
        super(messageModel);
    }
}

@Injectable()
export class ConversationRepository extends BaseRepository<Conversation> implements IConversationRepository {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>
    ) {
        super(conversationModel);
    }
}