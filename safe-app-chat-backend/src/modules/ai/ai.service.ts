import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs'; // Convert Observables to Promises
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AIService {
  private readonly apiKey = process.env.AI_SERVICE_API_KEY;
  private readonly apiEndpoint = process.env.AI_SERVICE_ENDPOINT;

  constructor(private readonly httpService: HttpService) {
    if (!this.apiKey || !this.apiEndpoint) {
      throw new Error('AI_SERVICE_API_KEY or AI_SERVICE_ENDPOINT is missing in .env');
    }
  }

  // Method to check the health of the AI service
  async checkHealth(): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.apiEndpoint}/health-check`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error checking AI service health:', error);
      throw new HttpException('Failed to connect to AI service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
