import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';
import { BusinessException } from '../exceptions/biz.exception';
import { isDev } from '~/global/env';
import { ErrorCode } from '~/constants/error-code.constant';

interface MyError {
    status: number;
    statusCode?: number;
    message?: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private logger = new Logger(AllExceptionsFilter.name);

    constructor() {
        this.registerCatchAllExceptionsHook();
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<FastifyRequest>();
        const response = ctx.getResponse<FastifyReply>();

        const url = request.raw.url!;

        const status = this.getStatus(exception);
        let message = this.getErrorMessage(exception);

        if (
            status === HttpStatus.INTERNAL_SERVER_ERROR &&
            !(exception instanceof BusinessException)
        ) {
            Logger.error(exception, undefined, 'Catch');

            if (!isDev) message = ErrorCode.SERVER_ERROR.split(':')[1];
        } else {
            this.logger.warn(
                `Error message: (${status}) ${message} Path: ${decodeURI(url)}`
            );
        }

        const apiErrorCode =
            exception instanceof BusinessException
                ? exception.getErrorCode()
                : status;

        const responseBody: IBaseResponse = {
            code: apiErrorCode,
            message,
            data: null,
        };

        response.status(status).send(responseBody);
    }

    getStatus(exception: unknown): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        } else if (exception instanceof QueryFailedError) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        } else {
            return (
                (exception as MyError)?.status ??
                (exception as MyError)?.statusCode ??
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    getErrorMessage(exception: unknown): string {
        if (exception instanceof HttpException) {
            return exception.message;
        } else if (exception instanceof QueryFailedError) {
            return exception.message;
        } else {
            return (
                (exception as any)?.response?.message ??
                (exception as MyError)?.message ??
                `${exception}`
            );
        }
    }

    registerCatchAllExceptionsHook() {
        process.on('unhandledRejection', reason => {
            console.error('unhandledRejection: ', reason);
        });

        process.on('uncaughtException', error => {
            console.error('uncaughtException: ', error);
        });
    }
}
