import { IBaseRepository } from "src/common/base.interface";
import { User } from "../user/user.schema";

export interface UserRepositoryInterface extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>
}