import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { AdminRepository } from './admin.repository';
import { AdminMapperProfile } from './mapper/admin.mapper-profile';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, AdminMapperProfile],
  exports: [AdminRepository],
})
export class AdminModule { }
