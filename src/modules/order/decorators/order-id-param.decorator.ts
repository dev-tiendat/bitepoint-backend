import {
    HttpStatus,
    NotAcceptableException,
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';

export function OrderIdParam() {
    return Param(
        'id',
        new ParseUUIDPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            exceptionFactory() {
                throw new NotAcceptableException(
                    'order id format is incorrect'
                );
            },
        })
    );
}
