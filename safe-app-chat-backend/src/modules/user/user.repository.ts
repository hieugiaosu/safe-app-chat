import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { IUserRepository } from './user.interface';
import { User } from './user.schema';


@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        super(userModel)
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.findByConditions({ email })
    }
}
