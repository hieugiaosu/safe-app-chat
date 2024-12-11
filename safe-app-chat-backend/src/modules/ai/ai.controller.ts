import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AIService } from './ai.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('health-check')
  async healthCheck() {
    try {
      const response = await this.aiService.checkHealth();
      return response; // Return the AI service's health check response
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to check AI service health',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
