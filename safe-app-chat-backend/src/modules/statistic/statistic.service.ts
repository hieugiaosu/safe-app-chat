import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../chat/schema/message.schema';
import * as mongoose from 'mongoose'; // Import mongoose để debug

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getToxicMessagesStats(year: number) {
    mongoose.set('debug', true); // Bật debug mode của Mongoose

    console.log("Năm được nhận:", year);

    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const endOfYear = new Date(Date.UTC(year + 1, 0, 1));

    console.log("startOfYear (UTC):", startOfYear.toISOString());
    console.log("endOfYear (UTC):", endOfYear.toISOString());

    const stats = await this.messageModel.aggregate([
      {
        $match: {
            isToxic: true, // Lọc tin nhắn độc hại
            createdAt: { // Lọc theo khoảng thời gian của năm được chọn
                $gte: startOfYear,
                $lt: endOfYear,
              },
          },
        },
        {
          $group: {
            _id: { 
              month: { $month: '$createdAt' }, // Nhóm theo tháng
            },
            count: { $sum: 1 }, // Đếm số lượng tin nhắn
          },
        },
        {
          $sort: { '_id': 1 }, // Sắp xếp theo tháng
        },
      ]);

      console.log("Kết quả từ aggregate:", JSON.stringify(stats, null, 2));

      // Tạo đủ dữ liệu cho 12 tháng, mặc định là 0
      const completeStats = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        count: 0,
      }));
  
      stats.forEach((stat) => {
        const monthIndex = stat._id.month - 1; // Đổi sang index (0-based)
        completeStats[monthIndex].count = stat.count;
      });
  
      return completeStats;
}
}
