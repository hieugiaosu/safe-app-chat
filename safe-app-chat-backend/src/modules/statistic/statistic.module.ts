import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../chat/schema/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), // Kết nối schema với MongoDB
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}