import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

type Payload = keyof IAuthUser;

export const WsAuthUser = createParamDecorator(
    (data: Payload, ctx: ExecutionContext) => {
        const client: Socket = ctx.switchToWs().getClient();
        const user = client.data.user;

        return data ? user?.[data] : user;
    }
);
