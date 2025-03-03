import { Controller, Get } from '@nestjs/common';

import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';
import { FeedbackService } from './feedback.service';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { FeedbackDetail } from './feedback.model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

const permissions = definePermission('feedback', {
    LIST: 'list',
});

@Controller({
    path: 'feedbacks',
    version: '1',
})
@ApiTags('Feedback - Mô đun quản lý phản hồi')
export class FeedbackController {
    constructor(private feedbackService: FeedbackService) {}

    @Get()
    @Perm(permissions.LIST)
    @ApiResult({ type: [FeedbackDetail] })
    @ApiOperation({ summary: 'Lấy danh sách tất cả phản hồi' })
    async list() {
        return this.feedbackService.list();
    }
}
