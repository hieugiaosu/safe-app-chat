import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserRepositoryInterface } from './user.interface';
import { BaseAbstractRepository } from '../../common/base.repository';

@Injectable()
export class UserRepository extends BaseAbstractRepository<User> implements UserRepositoryInterface {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        super(userModel)
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.findByConditions({ email })
    }
}
