import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { isEmpty, isNil } from 'lodash';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import { USER_ROLE_ID } from '~/constants/system.constant';
import { randomValue } from '~/utils/tool.util';
import { md5 } from '~/utils/crypto.util';
import { RegisterDto } from '../auth/dto/auth.dto';
import { RoleEntity } from '../system/role/role.entity';
import { UserEntity } from './user.entity';
import { UserStatus } from './user.constant';
import { AccountInfo } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ) {}

    async findUserByUsername(username: string) {
        return this.userRepository
            .createQueryBuilder('user')
            .where({ username, status: UserStatus.Enabled })
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

        delete user?.psalt;

        return user;
    }

    async exist(username: string) {
        const user = await this.userRepository.findOneBy({ username });
        if (!isNil(user))
            throw new BusinessException(ErrorCode.SYSTEM_USER_EXISTS);

        return true;
    }

    async registerCustomerAccount({
        username,
        password,
        ...data
    }: RegisterDto) {
        const exists = await this.userRepository.findOneBy({ username });
        if (!isEmpty(exists))
            throw new BusinessException(ErrorCode.SYSTEM_USER_EXISTS);

        const newUser = await this.entityManager.transaction(async manager => {
            const salt = randomValue(32);
            console.log(data);

            const hashedPassword = md5(`${password ?? 'a123456'}${salt}`);
            const role = await this.roleRepository.findOneBy({
                id: USER_ROLE_ID,
            });

            const user = manager.create(UserEntity, {
                username,
                password: hashedPassword,
                roles: [role],
                status: UserStatus.Enabled,
                psalt: salt,
                ...data,
            });

            return await manager.save(user);
        });

        return newUser;
    }
}
