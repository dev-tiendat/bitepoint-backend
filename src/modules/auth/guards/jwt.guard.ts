import { AuthGuard } from '@nestjs/passport';
import {
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { ExtractJwt } from 'passport-jwt';
import { isEmpty, isNil } from 'lodash';
import Redis from 'ioredis';

import { AppConfig, IAppConfig, RouterWhitelist } from '~/config';
import { InjectRedis } from '~/common/decorators/inject-redis.decorator';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import {
    genTokenBlacklistKey,
    genTokenPersistentKey,
} from '~/helper/genRedisKey';
import { TokenService } from '../services/token.service';
import { AuthStrategy, PUBLIC_KEY } from '../auth.constant';
import { AuthService } from '../auth.service';

interface RequestType {
    Params: {
        uid: string;
    };
    Querystring: {
        token?: string;
    };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
    private jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken();

    constructor(
        @InjectRedis()
        private redis: Redis,
        @Inject(AppConfig.KEY)
        private appConfig: IAppConfig,
        private reflector: Reflector,
        private tokenService: TokenService,
        private authService: AuthService
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context
            .switchToHttp()
            .getRequest<FastifyRequest<RequestType>>();

        if (RouterWhitelist.includes(request.routeOptions.url)) return true;

        const isSse = request.headers.accept === 'text/event-stream';
        if (isSse && !request.headers.authorization?.startsWith('Bearer ')) {
            const { token } = request.query;
            if (token) {
                request.headers.authorization = `Bearer ${token}`;
            }
        }

        const token = this.jwtFromRequestFn(request);

        if (await this.redis.get(genTokenBlacklistKey(token)))
            throw new BusinessException(ErrorCode.INVALID_LOGIN);

        request.accessToken = token;

        let result: any = false;
        try {
            result = await super.canActivate(context);
        } catch (error) {
            if (isPublic) return true;

            if (isEmpty(token))
                throw new UnauthorizedException('Not logged in');

            if (error instanceof UnauthorizedException)
                throw new BusinessException(ErrorCode.ACCESS_TOKEN_EXPIRED);

            const isValid = isNil(token)
                ? false
                : await this.tokenService.checkAccessToken(token);

            if (!isValid) throw new BusinessException(ErrorCode.INVALID_LOGIN);
        }

        if (isSse) {
            const { uid } = request.params;

            if (Number(uid) !== request.user.uid)
                throw new UnauthorizedException(
                    'The path parameter uid is inconsistent with the uid of the user logged in with the current token'
                );
        }

        const pv = await this.authService.getPasswordVersionByUid(
            request.user.uid
        );
        const tokenPersistent = await this.redis.get(
            genTokenPersistentKey(token)
        );
        if (pv !== request.user.pv.toString() && token !== tokenPersistent)
            throw new BusinessException(ErrorCode.PASSWORD_CHANGED);

        if (!this.appConfig.multiDeviceLogin) {
            const cacheToken = await this.authService.getTokenByUid(
                request.user.uid
            );

            if (cacheToken !== token)
                throw new BusinessException(
                    ErrorCode.ACCOUNT_LOGGED_IN_ELSEWHERE
                );
        }

        return result;
    }
}
