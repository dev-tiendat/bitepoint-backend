import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { isEmpty, isNil } from 'lodash';
import Redis from 'ioredis';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { BusinessException } from '~/common/exceptions/biz.exception';
import { InjectRedis } from '~/common/decorators/inject-redis.decorator';
import { ErrorCode } from '~/constants/error-code.constant';
import { USER_ROLE_ID } from '~/constants/system.constant';
import {
    genAuthPasswordVersionKey,
    genTokenPersistentKey,
} from '~/helper/genRedisKey';
import { randomValue } from '~/utils/tool.util';
import { md5 } from '~/utils/crypto.util';
import {
    AccountUpdateDto,
    PasswordUpdateDto,
    RegisterDto,
} from '../auth/dto/auth.dto';
import { RoleEntity } from '../system/role/role.entity';
import { UserEntity } from './user.entity';
import { UserStatus } from './user.constant';
import { AccountInfo } from './user.model';
import { ISecurityConfig, SecurityConfig } from '~/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectRedis()
        private redis: Redis,
        @InjectMapper()
        private mapper: Mapper,
        @Inject(SecurityConfig.KEY)
        private securityConfig: ISecurityConfig
    ) {}

    async findUserByUsername(username: string): Promise<UserEntity> {
        return this.userRepository
            .createQueryBuilder('user')
            .where({ username, status: UserStatus.ENABLED })
            .getOne();
    }

    async getAccountInfo(uid: number): Promise<AccountInfo> {
        const user: UserEntity = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .where(`user.id = :uid`, { uid })
            .getOne();

        if (isEmpty(user))
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);

        return this.mapper.map(user, UserEntity, AccountInfo);
    }

    async updateAccountInfo(
        uid: number,
        info: AccountUpdateDto
    ): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: uid });
        if (isEmpty(user))
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);

        await this.userRepository.update(uid, info);
    }

    async exist(username: string) {
        const user = await this.userRepository.findOneBy({ username });
        if (!isNil(user))
            throw new BusinessException(ErrorCode.SYSTEM_USER_EXISTS);

        return true;
    }

    async updatePassword(
        authUser: IAuthUser,
        token: string,
        dto: PasswordUpdateDto
    ): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: authUser.uid });
        if (isEmpty(user))
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);

        const comparePassword = md5(`${dto.oldPassword}${user.psalt}`);
        if (user.password !== comparePassword)
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);

        const newPassword = md5(`${dto.newPassword}${user.psalt}`);
        await this.userRepository.update(
            { id: authUser.uid },
            { password: newPassword }
        );
        await this.updatePasswordVersion(user.id);
        await this.setTokenPersistent(authUser, token);
    }

    async registerCustomerAccount({
        username,
        password,
        ...data
    }: RegisterDto): Promise<void> {
        const exists = await this.userRepository.findOneBy({ username });

        if (!isEmpty(exists))
            throw new BusinessException(ErrorCode.SYSTEM_USER_EXISTS);

        await this.entityManager.transaction(async manager => {
            const salt = randomValue(32);

            const hashedPassword = md5(`${password ?? 'a123456'}${salt}`);
            const role = await this.roleRepository.findOneBy({
                id: USER_ROLE_ID,
            });

            const user = manager.create(UserEntity, {
                username,
                password: hashedPassword,
                roles: [role],
                status: UserStatus.ENABLED,
                psalt: salt,
                ...data,
            });

            return await manager.save(user);
        });
    }

    async updatePasswordVersion(uid: number) {
        const passwordVersion = await this.redis.get(
            genAuthPasswordVersionKey(uid)
        );
        if (!isEmpty(passwordVersion))
            await this.redis.set(
                genAuthPasswordVersionKey(uid),
                Number.parseInt(passwordVersion) + 1
            );
    }

    async setTokenPersistent(user: IAuthUser, token: string): Promise<void> {
        const exp = user.exp
            ? (user.exp - Date.now() / 1000).toFixed(0)
            : this.securityConfig.jwtExpire;
        await this.redis.set(genTokenPersistentKey(token), token, 'EX', exp);
    }
}
