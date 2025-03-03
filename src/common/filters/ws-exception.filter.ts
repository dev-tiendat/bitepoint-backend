import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { isDev } from '~/global/env';

// @Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
    private logger = new Logger(WsExceptionsFilter.name);

    catch(exception: WsException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient();
        // client.emit('exception', exception.getError());

        // if (isDev) this.logger.error(exception.getError());
    }
}
