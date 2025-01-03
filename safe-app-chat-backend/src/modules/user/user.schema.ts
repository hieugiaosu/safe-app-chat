import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user', timestamps: true })
export class User {
    @AutoMap()
    _id: Types.ObjectId;

    @AutoMap()
    @Prop()
    firstName: string;

    @AutoMap()
    @Prop()
    lastName: string;

    @AutoMap()
    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @AutoMap()
    createdAt: Date;

    @AutoMap()
    updatedAt: Date;

    @AutoMap()
    @Prop({ default: '0' })  // Role mặc định là '0'
    role: string;

    @AutoMap()
    @Prop({ default: true })  // Trạng thái isActive mặc định là true
    isActive: boolean;
}

// export class UserObject extends User {
//     @AutoMap()
//     _id: Types.ObjectId;

//     @AutoMap()
//     createdAt: string;

//     @AutoMap()
//     updatedAt: string;
// }

export const UserSchema = SchemaFactory.createForClass(User);