import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { flattenDeep } from 'lodash';

import { CreatorPipe } from '~/common/pipes/creator.pipe';
import { UpdaterPipe } from '~/common/pipes/updater.pipe';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { MenuItemDto, MenuQueryDto, MenuUpdateDto } from './menu.dto';
import { MenuService } from './menu.service';
import {
    definePermission,
    getDefinePermissions,
} from '~/modules/auth/decorators/permission.decorator';
import { MenuItemInfoAndParentInfo } from './menu.model';

export const permissions = definePermission('system:menu', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
} as const);

@Controller({
    path: 'menus',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('System - Mô dun cấp phép Menu')
export class MenuController {
    constructor(private menuService: MenuService) {}

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả menu' })
    async list(@Query() dto: MenuQueryDto) {
        return this.menuService.list(dto);
    }

    @Get(':id')
    @ApiResult({ type: MenuItemInfoAndParentInfo })
    @ApiOperation({ summary: 'Lấy thông tin menu hoặc quyền' })
    async info(@IdParam() id: number): Promise<MenuItemInfoAndParentInfo> {
        return this.menuService.getMenuItemAndParentInfo(id);
    }

    @Post()
    @ApiOperation({ summary: 'Thêm menu hoặc quyền mới' })
    async create(@Body(CreatorPipe) dto: MenuItemDto): Promise<void> {
        await this.menuService.check(dto);
        if (!dto.parentId) dto.parentId = null;

        await this.menuService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhập menu hoặc quuyền' })
    async update(
        @IdParam() id: number,
        @Body(UpdaterPipe)
        dto: MenuUpdateDto
    ): Promise<void> {
        await this.menuService.check(dto);
        if (dto.parentId === -1 || !dto.parentId) dto.parentId = null;

        await this.menuService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xoá menu hoặc quyền' })
    async delete(@IdParam() id: number) {
        if (await this.menuService.checkRoleByMenuId(id))
            throw new BadRequestException(
                'This menu has associated roles and cannot be deleted'
            );

        const childMenus = await this.menuService.findChildMenus(id);
        await this.menuService.deleteMenuItem(flattenDeep([id, childMenus]));
    }

    @Get('permissions')
    @ApiResult({ type: [String] })
    @ApiOperation({
        summary: 'Lấy ra tất cả các quyền được xác định trên backend',
    })
    async getPermissions(): Promise<string[]> {
        return getDefinePermissions();
    }
}
