import { Types } from "mongoose";
import { User } from "../modules/user/user.schema";

export const generateUser = ({ id = "66f19519cdebdcac0f19c943", email = "john.doe@example.com", password = "password" }: { id?: string; email?: string, password?: string }) => {
    const user: User = {
        _id: new Types.ObjectId(id),
        firstName: 'John',
        lastName: 'Doe',
        email,
        password,
        updatedAt: new Date(),
        createdAt: new Date()
    };
    return user;
};