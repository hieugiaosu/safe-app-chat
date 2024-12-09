import { IBaseRepository } from "src/common/base.interface";
import { User } from "./user.schema";

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>
}