import { Controller, Get, Query } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import moment from 'moment-timezone';

import { EventBusEvents } from '~/constants/event-bus.constant';
import {
    definePermission,
    Perm,
} from '~/modules/auth/decorators/permission.decorator';

import { GatesManagerService } from './gateway-manager.service';
import { ApiTags } from '@nestjs/swagger';

const permissions = definePermission('gateway', {
    STOP_CRON: 'stop_cron',
});

@Controller('gateway')
@ApiTags('Gateway - Mô đun quản lý cổng')
export class GatewayController {
    constructor(private readonly gateManagerService: GatesManagerService) {}

    @Get('stop-gate')
    @Perm(permissions.STOP_CRON)
    stopGate(
        @Query('name') name: string,
        @Query('time_in_sec') timeInSec: number
    ) {
        this.gateManagerService.stopCron(name, timeInSec);
        return {
            message: 'ok',
            next_run: moment()
                .add(timeInSec, 'seconds')
                .tz('Asia/Ho_Chi_Minh')
                .format('DD-MM-YYYY HH:mm:ss'),
        };
    }

    @OnEvent(EventBusEvents.GatewayStopCron)
    stopGateCron() {
        this.gateManagerService.stopAllCron();
    }

    @OnEvent(EventBusEvents.GatewayStartCron)
    startGateCron() {
        this.gateManagerService.startAllCron();
    }
}
