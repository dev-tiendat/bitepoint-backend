import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { map, Observable } from 'rxjs';
import qs from 'qs';

import { BYPASS_KEY } from '../decorators/bypass.decorator';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { ResOp } from '../model/response.model';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {
        const bypass = this.reflector.get<boolean>(
            BYPASS_KEY,
            context.getHandler()
        );
        const message = this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler()
        );

        if (bypass) next.handle();

        const http = context.switchToHttp();
        const request = http.getRequest<FastifyRequest>();
        const response = http.getResponse<FastifyReply>();
        request.query = qs.parse(request.url.split('?').at(1));

        return next.handle().pipe(
            map(data => {
                if (data instanceof ResOp) return data;

                return new ResOp(
                    response.statusCode ?? HttpStatus.OK,
                    data || null,
                    message
                );
            })
        );
    }

    // transformDateFieldsToUnix(data: Record<string, any>): Record<string, any> {
    //     let result: Record<string, any> = {};
    //     if (Array.isArray(data))
    //         result = data.map(item => this.transformDateFieldsToUnix(item));
    //     else {
    //         for (const key in data) {
    //             if (data[key] instanceof Date) {
    //                 result[key] = dayjs(data[key]).unix();
    //             } else if (
    //                 typeof data[key] === 'object' &&
    //                 data[key] !== null
    //             ) {
    //                 result[key] = this.transformDateFieldsToUnix(data[key]);
    //             } else {
    //                 result[key] = data[key];
    //             }
    //         }
    //     }

    //     return result;
    // }
}
