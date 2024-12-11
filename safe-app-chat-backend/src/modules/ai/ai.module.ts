import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';

@Module({
  imports: [HttpModule], // Import the HttpModule here
  controllers: [AIController],
  providers: [AIService],
})
export class AiModule {}
