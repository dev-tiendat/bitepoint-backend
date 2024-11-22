import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { In, Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { ROOT_ROLE_ID } from '~/constants/system.constant';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>
    ) {}

    async list() {
        const queryBuilder = await this.roleRepository.find();

        return queryBuilder;
    }

    async getRoleIdsByUserId(id: number): Promise<number[]> {
        const roles = await this.roleRepository.findBy({
            users: { id },
        });

        if (!isEmpty(roles)) return roles.map(r => r.id);

        return [];
    }

    async getRoleValues(ids: number[]): Promise<string[]> {
        return (
            await this.roleRepository.findBy({
                id: In(ids),
            })
        ).map(v => v.value);
    }

    hasAdminRole(rids: number[]): boolean {
        return rids.includes(ROOT_ROLE_ID);
    }
}
