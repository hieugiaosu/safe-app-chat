import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
    constructor(private statisticService: StatisticService) { }

    @Get('toxic-messages/:year')
    async getToxicMessagesStats(@Param('year') year: string) {
      try {
        const stats = await this.statisticService.getToxicMessagesStats(Number(year));
        console.log(stats);
        return stats;
      } catch (error) {
        throw new HttpException(
          'Failed to fetch toxic message statistics',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }