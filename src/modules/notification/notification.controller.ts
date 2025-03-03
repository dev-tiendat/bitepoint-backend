import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';

import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { NotificationService } from './notification.service';
import { Public } from '../auth/decorators/public.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { NotificationEntity } from './notification.entity';

@Controller({
    path: 'notifications',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Notification - Thông báo')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get()
    @Public()
    @ApiResult({ type: [NotificationEntity] })
    @ApiOperation({ summary: 'Lấy danh sách thông báo' })
    async list(@AuthUser('uid') uid: number) {
        return this.notificationService.list(uid);
    }
}
