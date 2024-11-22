import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import { AuthService } from '../auth.service';
import { ALLOW_ANON_KEY, PUBLIC_KEY, Roles } from '../auth.constant';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const { user } = request;
        if (isEmpty(user)) throw new BusinessException(ErrorCode.INVALID_LOGIN);

        const allowAnon = this.reflector.get<boolean>(
            ALLOW_ANON_KEY,
            context.getHandler()
        );
        if (allowAnon) return true;

        const payloadPermission = this.reflector.getAllAndOverride<
            string | string[]
        >(ALLOW_ANON_KEY, [context.getHandler(), context.getClass()]);
        if (isEmpty(payloadPermission)) return true;

        if (user.roles.includes(Roles.ADMIN)) return true;
    }
}
