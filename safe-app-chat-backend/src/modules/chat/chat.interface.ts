import { IBaseRepository } from "src/common/base.interface";
import { Conversation } from "./schema/conversation.schema";
import { Message } from "./schema/message.schema";

export interface IMessageRepository extends IBaseRepository<Message> {}

export interface IConversationRepository extends IBaseRepository<Conversation> {}