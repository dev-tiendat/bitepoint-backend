import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

type Payload = keyof IAuthUser;

export const AuthUser = createParamDecorator(
    (data: Payload, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        const user = request.user;

        return data ? user?.[data] : user;
    }
);
