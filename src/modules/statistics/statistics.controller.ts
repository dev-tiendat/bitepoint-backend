import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';

@Controller({ path: 'statistics', version: '1' })
@ApiSecurityAuth()
@ApiTags('Statistics - Mô đun thống kê')
export class StatisticsController {
    constructor(private statisticsService: StatisticsService) {}

    @Get()
    @ApiOperation({ summary: 'Lấy thông tin thống kê' })
    async getStatistics() {
        return this.statisticsService.getStatistics();
    }
}
