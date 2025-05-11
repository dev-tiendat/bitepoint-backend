import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { In, Repository } from 'typeorm';
import { isEmpty } from 'lodash';

import { ROOT_ROLE_ID } from '~/constants/system.constant';

import { MenuService } from '../menu/menu.service';
import { RoleEntity } from './role.entity';
import { RoleDto, RoleInfo, RoleUpdateDto } from './role.model';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
        @Inject(forwardRef(() => MenuService))
        private menuService: MenuService,
        @InjectEntityManager()
        private entityManager,
        @InjectMapper()
        private mapper: Mapper
    ) {}

    async list() {
        const queryBuilder = await this.roleRepository.find();

        return queryBuilder;
    }

    async info(id: number) {
        const info = await this.roleRepository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.menus', 'menu')
            .where('role.id = :id', { id })
            .getOne();

        return info;
    }

    async create({ menuIds, ...data }: RoleDto): Promise<void> {
        await this.roleRepository.save({
            ...data,
            menus: menuIds ? await this.menuService.findByIds(menuIds) : [],
        });
    }

    async update(
        id: number,
        { menuIds, ...data }: RoleUpdateDto
    ): Promise<void> {
        await this.roleRepository.update(id, data);
        await this.entityManager.transaction(async manager => {
            const role = await this.roleRepository.findOneBy({ id });
            role.menus = menuIds?.length
                ? await this.menuService.findByIds(menuIds)
                : [];
            await manager.save(role);
        });
    }

    async delete(id: number): Promise<void> {
        if (id === ROOT_ROLE_ID)
            throw new BadRequestException('Cannot delete super administrator');

        await this.roleRepository.delete(id);
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

    async getRoleInfo(ids: number[]): Promise<RoleInfo[]> {
        const result = await this.roleRepository.findBy({
            id: In(ids),
        });

        return this.mapper.mapArray(result, RoleEntity, RoleInfo);
    }

    hasAdminRole(rids: number[]): boolean {
        return rids.includes(ROOT_ROLE_ID);
    }

    checkUserByRoleId(id: number): Promise<boolean> {
        return this.roleRepository.exists({
            where: {
                users: {
                    roles: { id },
                },
            },
        });
    }
}
