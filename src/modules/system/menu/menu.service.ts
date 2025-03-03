import {
    Injectable,
    Inject,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Not, Repository } from 'typeorm';
import { concat, isEmpty, isNil } from 'lodash';

import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import { generatorMenu } from '~/utils/permission.util';
import { deleteEmptyCHildren } from '~/utils/list2tree.util';

import { RoleService } from '../role/role.service';

import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto';
import { MenuItemInfoAndParentInfo } from './menu.model';
import { MenuType } from './menu.constant';
import { MenuEntity } from './menu.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuEntity)
        private menuRepository: Repository<MenuEntity>,
        @Inject(forwardRef(() => RoleService))
        private roleService: RoleService
    ) {}

    async list({ name, path, permission, component, status }: MenuQueryDto) {
        const menus = await this.menuRepository.find({
            where: {
                ...(name && { name: Like(`%${name}%`) }),
                ...(path && { path: Like(`%${path}%`) }),
                ...(permission && { permission: Like(`%${permission}%`) }),
                ...(component && { component: Like(`%${component}%`) }),
                ...(!isNil(status) ? { status } : null),
            },
        });
        const menuList = generatorMenu(menus);

        if (!isEmpty(menuList)) {
            deleteEmptyCHildren(menuList);
            return menuList;
        }

        return menus;
    }

    async create(menu: MenuDto): Promise<void> {
        await this.menuRepository.save(menu);
    }

    async update(id: number, menu: MenuUpdateDto): Promise<void> {
        await this.exist(id);
        await this.menuRepository.update(id, menu);
    }

    async deleteMenuItem(ids: number[]): Promise<void> {
        await this.menuRepository.delete(ids);
    }

    async check(dto: Partial<MenuDto>): Promise<void> {
        if (dto.type === MenuType.PERMISSION && isNil(dto.parentId))
            throw new BusinessException(ErrorCode.PERMISSION_REQUIRES_PARENT);

        if (dto.type === MenuType.MENU && dto.parentId) {
            const parent = await this.getMenuItemInfo(dto.parentId);
            if (isNil(parent))
                throw new BusinessException(ErrorCode.PARENT_MENU_NOT_FOUND);

            if (parent.type !== MenuType.MENU_GROUP)
                throw new BusinessException(
                    ErrorCode.ILLEGAL_OPERATION_DIRECTORY_PARENT
                );
        }
    }

    async findChildMenus(id: number): Promise<any> {
        const allMenus: any[] = [];
        const menus = await this.menuRepository.findBy({ parentId: id });
        for (const menu of menus) {
            if (menu.type !== MenuType.PERMISSION) {
                const childMenus = await this.findChildMenus(menu.id);
                allMenus.push(childMenus);
            }
            allMenus.push(menu.id);
        }

        return allMenus;
    }

    async getMenuItemInfo(menuId: number): Promise<MenuEntity> {
        const menu = await this.menuRepository.findOneBy({ id: menuId });

        return menu;
    }

    async getMenuItemAndParentInfo(
        id: number
    ): Promise<MenuItemInfoAndParentInfo> {
        const menu = await this.menuRepository.findOneBy({ id });
        let parentMenu: MenuEntity | undefined;
        if (menu && menu.parentId)
            parentMenu = await this.menuRepository.findOneBy({
                id: menu.parentId,
            });

        return { menu, parentMenu };
    }

    async getPermissions(uid: number): Promise<string[]> {
        const roleIds = await this.roleService.getRoleIdsByUserId(uid);
        let permission: string[] = [];
        let result: MenuEntity[] = null;
        if (this.roleService.hasAdminRole(roleIds)) {
            result = await this.menuRepository.findBy({
                permission: Not(IsNull()),
                type: In([MenuType.MENU_GROUP, MenuType.PERMISSION]),
            });
        } else {
            if (isEmpty(roleIds)) return permission;

            result = await this.menuRepository
                .createQueryBuilder('menu')
                .innerJoinAndSelect('menu.roles', 'role')
                .andWhere('role.id IN (:...roleIds)', { roleIds })
                .andWhere('menu.type IN(:...menuTypes)', {
                    menuTypes: [MenuType.MENU_GROUP, MenuType.PERMISSION],
                })
                .andWhere('menu.permission IS NOT NULL')
                .getMany();
        }

        if (!isEmpty(result)) {
            result.forEach(menu => {
                if (menu.permission)
                    permission = concat(permission, menu.permission.split(','));
            });
        }

        return permission;
    }

    async exist(id: number): Promise<boolean> {
        const menu = await this.menuRepository.findOneBy({ id });
        if (isNil(menu))
            throw new NotFoundException(`Menu id ${id} does not exist`);

        return true;
    }

    async findByIds(ids: number[]): Promise<MenuEntity[]> {
        return this.menuRepository.find({
            where: { id: In(ids) },
        });
    }

    async checkRoleByMenuId(id: number): Promise<boolean> {
        return !!(await this.menuRepository.findOne({
            where: {
                roles: { id },
            },
        }));
    }

    async formatMenu(dto: Partial<MenuDto>) {
        if (dto.type) {
        }
    }
}
