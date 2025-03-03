import {
    CallHandler,
    ExecutionContext,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { startsWith } from 'lodash';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger(LoggingInterceptor.name, { timestamp: false });

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {
        const call = next.handle();
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        if (startsWith(request.url, '/files')) {
            return call;
        }

        const content = `${request.method} ->  ${request.url}`;
        this.logger.debug(`+++ Request: ${content}`);

        const isSse = request.headers.accept === 'text/event-stream';
        const now = Date.now();

        return call.pipe(
            tap(() => {
                if (isSse) return;

                this.logger.debug(
                    `--- Response: ${content}${` +${Date.now() - now}ms`}`
                );
            })
        );
    }
}
