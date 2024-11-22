import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { getIp } from '~/utils/ip.util';

export const Ip = createParamDecorator((_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    return getIp(request);
});