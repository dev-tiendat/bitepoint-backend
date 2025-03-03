import {
    BeforeApplicationShutdown,
    Controller,
    Headers,
    Ip,
    Param,
    ParseIntPipe,
    Req,
    Res,
    Sse,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { FastifyReply, FastifyRequest } from 'fastify';

import { interval, Observable } from 'rxjs';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';

import { MessageEvent, SseService } from './sse.service';

@ApiTags('System - Module SSE')
@ApiSecurityAuth()
@SkipThrottle()
@Controller({
    path: 'sse',
    version: '1',
})
export class SseController implements BeforeApplicationShutdown {
    private replyMap: Map<number, FastifyReply> = new Map();

    constructor(private readonly sseService: SseService) {}

    private closeAllConnect() {
        this.sseService.sendToAllUser({
            type: 'close',
            data: 'bye~',
        });
        this.replyMap.forEach(reply => {
            reply.raw.end().destroy();
        });
    }

    beforeApplicationShutdown() {
        this.closeAllConnect();
    }

    @ApiOperation({ summary: 'Đẩy thông báo' })
    @Sse(':uid')
    async sse(
        @Param('uid', ParseIntPipe) uid: number,
        @Req() req: FastifyRequest,
        @Res() res: FastifyReply,
        @Ip() ip: string,
        @Headers('user-agent') ua: string
    ): Promise<Observable<MessageEvent>> {
        this.replyMap.set(uid, res);

        return new Observable(subscriber => {
            const subscription = interval(1000).subscribe(() => {
                subscriber.next({ type: 'ping' });
            });

            this.sseService.addClient(uid, subscriber);

            req.raw.on('close', () => {
                subscription.unsubscribe();
                this.sseService.removeClient(uid, subscriber);
                this.replyMap.delete(uid);
            });
        });
    }
}
