import { BaseRepositoryInterface } from "src/common/base.interface";
import { User } from "./user.schema";

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
    findByEmail(email: string): Promise<User | null>
}