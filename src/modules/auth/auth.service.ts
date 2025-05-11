import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import Redis from 'ioredis';

import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import { InjectRedis } from '~/common/decorators/inject-redis.decorator';
import {
    genAuthPasswordVersionKey,
    genAuthPermKey,
    genAuthTokenKey,
    genTokenBlacklistKey,
} from '~/helper/genRedisKey';
import {
    AppConfig,
    IAppConfig,
    ISecurityConfig,
    SecurityConfig,
} from '~/config';
import { md5 } from '~/utils/crypto.util';
import { RoleService } from '../system/role/role.service';
import { UserService } from '../user/user.service';
import { TokenService } from './services/token.service';
import { AuthLoginResult } from './models/auth.model';
import { MenuService } from '../system/menu/menu.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRedis()
        private redis: Redis,
        @Inject(SecurityConfig.KEY)
        private securityConfig: ISecurityConfig,
        @Inject(AppConfig.KEY)
        private appConfig: IAppConfig,
        private userService: UserService,
        private roleService: RoleService,
        private tokenService: TokenService,
        private menuService: MenuService
    ) {}

    async validateUser(credential: string, password: string) {
        const user = await this.userService.findOneByUsername(credential);

        if (isEmpty(user))
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);

        const comparePassword = md5(`${password}${user.psalt}`);
        if (user.password !== comparePassword)
            throw new BusinessException(ErrorCode.INVALID_USERNAME_PASSWORD);

        if (user) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(
        usernameOrPhone: string,
        password: string,
        ip: string,
        ua: string
    ): Promise<AuthLoginResult> {
        const user = await this.userService.findOneByUsername(usernameOrPhone);
        if (isEmpty(user))
            throw new BusinessException(ErrorCode.INVALID_USERNAME_PASSWORD);

        const comparePassword = md5(`${password}${user.psalt}`);
        if (user.password !== comparePassword)
            throw new BusinessException(ErrorCode.INVALID_USERNAME_PASSWORD);

        const roleIds = await this.roleService.getRoleIdsByUserId(user.id);

        const roles = await this.roleService.getRoleInfo(roleIds);

        const token = await this.tokenService.generateRefreshToken(
            user.id,
            roles.map(v => v.value)
        );

        await this.redis.set(
            genAuthTokenKey(user.id),
            token.accessToken,
            'EX',
            this.securityConfig.jwtExpire
        );
        await this.redis.set(genAuthPasswordVersionKey(user.id), 1);

        const permissions = await this.menuService.getPermissions(user.id);
        await this.setPermissionsCache(user.id, permissions);

        const result: AuthLoginResult = {
            username: user.username,
            fullName: user.firstName + ' ' + user.lastName,
            avatar: user.avatar,
            roles,
            tokens: token,
        };
        return result;
    }

    async clearLoginStatus(
        user: IAuthUser,
        accessToken: string
    ): Promise<void> {
        const exp = user.exp
            ? (user.exp - Date.now() / 1000).toFixed(0)
            : this.securityConfig.jwtExpire;
        await this.redis.set(
            genTokenBlacklistKey(accessToken),
            accessToken,
            'EX',
            exp
        );

        if (this.appConfig.multiDeviceLogin) {
            await this.tokenService.removeAccessToken(accessToken);
        }
    }

    async generateNewAccessToken(refreshTokenValue: string): Promise<string> {
        await this.tokenService.checkRefreshToken(refreshTokenValue);
        const accessToken =
            await this.tokenService.refreshToken(refreshTokenValue);

        return accessToken;
    }

    async getPermissions(uid: number) {
        return this.menuService.getPermissions(uid);
    }

    async getMenus(uid: number) {
        // return this.menuService.get;
    }

    async setPermissionsCache(
        uid: number,
        permissions: string[]
    ): Promise<void> {
        await this.redis.set(genAuthPermKey(uid), JSON.stringify(permissions));
    }

    async getPermissionsCache(uid: number): Promise<string[]> {
        const permissionString = await this.redis.get(genAuthPermKey(uid));
        return permissionString ? JSON.parse(permissionString) : [];
    }

    async getPasswordVersionByUid(uid: number): Promise<string> {
        return this.redis.get(genAuthPasswordVersionKey(uid));
    }

    async getTokenByUid(uid: number): Promise<string> {
        return this.redis.get(genAuthTokenKey(uid));
    }
}
