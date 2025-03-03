import { WsException } from '@nestjs/websockets';
import { WsErrorCode } from '~/constants/error-code.constant';

export class WsBusinessException extends WsException {
    constructor(errorCode: WsErrorCode | string) {
        if (!errorCode.includes(':')) {
            super({
                code: 'error',
                message: errorCode,
            });
            return;
        }

        const [code, message] = errorCode.split(':');
        super({
            code,
            message,
        });
    }
}
