import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';

import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import { RouterWhitelist } from '~/config';

import { AuthService } from '../auth.service';
import {
    ALLOW_ANON_KEY,
    PERMISSION_KEY,
    PUBLIC_KEY,
    Roles,
} from '../auth.constant';
import { log } from 'console';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<FastifyRequest>();

        if (RouterWhitelist.includes(request.routeOptions.url)) return true;

        const { user } = request;

        if (isEmpty(user)) throw new BusinessException(ErrorCode.INVALID_LOGIN);

        const allowAnon = this.reflector.get<boolean>(
            ALLOW_ANON_KEY,
            context.getHandler()
        );
        if (allowAnon) return true;

        const payloadPermission = this.reflector.getAllAndOverride<
            string | string[]
        >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

        if (isEmpty(payloadPermission)) return true;

        if (user.roles.includes(Roles.ADMIN)) return true;

        const allPermissions =
            (await this.authService.getPermissionsCache(user.uid)) ??
            (await this.authService.getPermissions(user.uid));
        let canNext = false;

        if (Array.isArray(payloadPermission))
            canNext = payloadPermission.every(i => allPermissions.includes(i));

        if (typeof payloadPermission === 'string')
            canNext = allPermissions.includes(payloadPermission);

        if (!canNext) throw new BusinessException(ErrorCode.NO_PERMISSION);

        return true;
    }
}
