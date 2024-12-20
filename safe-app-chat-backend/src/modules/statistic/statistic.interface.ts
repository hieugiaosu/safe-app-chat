import { IBaseRepository } from "src/common/base.interface";
import { Message } from '../chat/schema/message.schema';

export interface UserRepositoryInterface extends IBaseRepository<Message> {
   
}