import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import { UserRepositoryInterface } from './admin.interface';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class AdminRepository extends BaseRepository<User> implements UserRepositoryInterface {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        super(userModel)
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.findByConditions({ email })
    }

    public async findAll(): Promise<User[]> {
      return this.userModel.find().exec();
    }

      public async findAllActiveUsers(): Promise<User[]> {
        return this.userModel.find({ isActive: true });
      }

      public async findAllUsersSortedByName(): Promise<User[]> {
        return this.userModel.find().sort({ email: 'asc' });
      }

      public async findAllUsersPaginated(page: number, limit: number): Promise<User[]> {
        return this.userModel.find().skip((page - 1) * limit).limit(limit);
      }

     // New methods for updating user role and active status
      public async updateUserRole(id: string, newRole: string): Promise<User | null> {
        console.log(`Cập nhật vai trò cho userId: ${id} thành ${newRole}`);

        // Kiểm tra người dùng có tồn tại không
        const updatedUser = await this.userModel.findByIdAndUpdate(
          id,
          { role: newRole }, // Cập nhật vai trò
          { new: true } // Trả về đối tượng đã được cập nhật
        );

        if (!updatedUser) {
          console.log('Không tìm thấy người dùng với id:', id);
          return null;
        }

        console.log('Kết quả cập nhật:', updatedUser);
        return updatedUser;
      }

      public async updateUserIsActive(id: string, status: boolean): Promise<User | null> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, 
          { isActive: status }, 
          { new: true }); // Uses findByIdAndUpdate with options
          
        console.log('Kết quả cập nhật:', updatedUser);
        return updatedUser;
      }
}
