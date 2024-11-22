import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = Symbol('__response_message_key__');

export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE_KEY, message);
