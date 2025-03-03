import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { BroadcastBaseGateway } from '../base.gateway';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '~/modules/auth/services/token.service';
import { CacheService } from '~/shared/redis/cache.service';
import { Namespace, Server, Socket } from 'socket.io';
import { EventBusEvents } from '~/constants/event-bus.constant';
import { BusinessEvents } from '../constants/business-event.constant';
import { OnEvent } from '@nestjs/event-emitter';

export interface AuthGatewayOptions {
    namespace?: string;
    authRequire?: boolean;
}

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export interface IAuthGateway
    extends OnGatewayConnection,
        OnGatewayDisconnect,
        BroadcastBaseGateway {}

export function createAuthGateway(
    options: AuthGatewayOptions
): new (...args: any[]) => IAuthGateway {
    const { namespace, authRequire = true } = options;

    class AuthGateway extends BroadcastBaseGateway implements IAuthGateway {
        constructor(
            protected jwtService: JwtService,
            protected tokenService: TokenService,
            private cacheService: CacheService
        ) {
            super();
        }

        @WebSocketServer()
        private _server: Server;

        @WebSocketServer()
        protected namespace: Namespace;

        async authFailed(client: Socket) {
            client.send(
                this.gatewayMessageFormat(
                    BusinessEvents.AUTH_FAILED,
                    'Auth failed'
                )
            );
            client.disconnect();
        }

        async authToken(token: string): Promise<boolean> {
            if (typeof token !== 'string') return false;

            const validJwt = async () => {
                try {
                    const ok = await this.jwtService.verifyAsync(token);

                    if (!ok) return false;
                } catch (error) {
                    return false;
                }

                return true;
            };

            return await validJwt();
        }

        async handleConnection(client: Socket) {
            const token =
                client.handshake.query.token ||
                client.handshake.headers.authorization ||
                client.handshake.headers.Authorization;

            if (!token && !authRequire) {
                super.handleConnect(client);
                return;
            }

            if (!token) {
                return this.authFailed(client);
            }

            const isValidToken = await this.authToken(token as string);
            if (!isValidToken) {
                return this.authFailed(client);
            }

            const sid = client.id;

            this.tokenSocketIdMap.set(token.toString(), sid);
        }

        handleDisconnect(client: Socket) {
            super.handleDisconnect(client);
        }

        tokenSocketIdMap = new Map<string, string>();

        @OnEvent(EventBusEvents.TokenExpired)
        handleTokenExpired(token: string) {
            const server = this.namespace.server;
            const sid = this.tokenSocketIdMap.get(token);
            if (!sid) return false;

            const socket = server.of(`/${namespace}`).sockets.get(sid);
            if (socket) {
                socket.disconnect();
                super.handleDisconnect(socket);
                return true;
            }
            return false;
        }

        override broadcast(event: string, data: any) {
            this.cacheService.emitter
                .of(`/${namespace}`)
                .emit(event as string, this.gatewayMessageFormat(event, data));
        }

        override broadcastAllUserAuth(event: string, data: any) {
            this.tokenSocketIdMap.forEach(socketId => {
                this._server.to(socketId).emit(event, data);
            });
        }
    }

    return AuthGateway;
}
