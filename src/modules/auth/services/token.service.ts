import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import Redis from 'ioredis';

import { ISecurityConfig, SecurityConfig } from '~/config';
import { UserEntity } from '~/modules/user/user.entity';
import { generateUUID } from '~/utils/tool.util';
import { InjectRedis } from '~/common/decorators/inject-redis.decorator';
import { RoleService } from '~/modules/system/role/role.service';
import { AuthToken } from '../models/auth.model';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { AccessTokenEntity } from '../entities/access-token.entity';
import { BizException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(AccessTokenEntity)
        private accessTokenRepository: Repository<AccessTokenEntity>,
        @InjectRepository(RefreshTokenEntity)
        private refreshTokenRepository: Repository<RefreshTokenEntity>,
        @Inject(SecurityConfig.KEY)
        private securityConfig: ISecurityConfig,
        @InjectRedis()
        private redis: Redis,
        private roleService: RoleService
    ) {}

    async refreshToken(refreshTokenValue: string): Promise<string> {
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: { value: refreshTokenValue },
            relations: ['accessToken', 'user'],
        });
        if (refreshToken) {
            const now = dayjs();

            if (now.isAfter(refreshToken.expiredAt))
                throw new BizException(ErrorCode.REFRESH_TOKEN_EXPIRED);

            const roleIds = await this.roleService.getRoleIdsByUserId(
                refreshToken.user.id
            );
            const roleValues = await this.roleService.getRoleValues(roleIds);

            await refreshToken.accessToken.remove();
            const token = await this.generateAccessToken(
                refreshToken,
                roleValues,
                now
            );

            return token;
        }

        return null;
    }

    async generateAccessToken(
        refreshToken: RefreshTokenEntity,
        roles: string[] = [],
        now: dayjs.Dayjs
    ) {
        const payload: IAuthUser = {
            uid: refreshToken.user.id,
            pv: 1,
            roles,
        };

        const jwtSign = await this.jwtService.signAsync(payload);

        const accessToken = new AccessTokenEntity();
        accessToken.value = jwtSign;
        accessToken.expiredAt = now
            .add(this.securityConfig.jwtExpire, 'second')
            .toDate();
        accessToken.refreshToken = refreshToken;

        await accessToken.save();

        return jwtSign;
    }

    async generateRefreshToken(
        uid: number,
        roles: string[]
    ): Promise<AuthToken> {
        const refreshTokenPayload = {
            uuid: generateUUID(),
        };
        const { refreshSecret, refreshExpire } = this.securityConfig;

        const refreshTokenSign = await this.jwtService.signAsync(
            refreshTokenPayload,
            {
                secret: refreshSecret,
                expiresIn: `${refreshExpire}s`,
            }
        );

        const now = dayjs();
        const refreshToken = new RefreshTokenEntity();
        refreshToken.value = refreshTokenSign;
        refreshToken.user = { id: uid } as UserEntity;
        refreshToken.expiredAt = now.add(refreshExpire, 'second').toDate();

        await refreshToken.save();

        const accessToken = await this.generateAccessToken(
            refreshToken,
            roles,
            now
        );

        return {
            accessToken,
            refreshToken: refreshTokenSign,
        } as AuthToken;
    }

    async removeAccessToken(value: string): Promise<void> {
        const accessToken = await this.accessTokenRepository.findOne({
            where: { value },
            relations: ['refreshToken'],
        });
        if (accessToken) {
            await accessToken.remove();
            await accessToken.refreshToken.remove();
        }
    }

    async removeRefreshToken(value: string): Promise<void> {
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: { value },
        });
        if (refreshToken) {
            // if(refreshToken.accessToken)
            await refreshToken.remove();
        }
    }

    async checkAccessToken(value: string) {
        let isValid = false;
        try {
            await this.verifyAccessToken(value);
            const res = await this.accessTokenRepository.findOne({
                where: { value },
                relations: ['user', 'refreshToken'],
                cache: true,
            });

            isValid = Boolean(res);
        } catch (error) {}

        return isValid;
    }

    async checkRefreshToken(value: string) {
        let isValid = false;
        try {
            await this.jwtService.verifyAsync(value, {
                secret: this.securityConfig.refreshSecret,
            });
            const res = await this.refreshTokenRepository.findOne({
                where: { value },
                relations: ['user', 'refreshToken'],
                cache: true,
            });

            const now = dayjs();
            if (now.isAfter(res.expiredAt)) isValid = false;

            isValid = Boolean(res);
        } catch (error) {}

        return isValid;
    }

    async verifyAccessToken(token: string): Promise<IAuthUser> {
        return this.jwtService.verifyAsync(token);
    }
}
