import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { ContentType } from '~/constants/http.constant';
import { Pagination } from '~/helper/paginate/pagination';

import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';
import { MenuItemService } from './menu-item.service';
import { MenuItemDto, MenuItemQueryDto } from './menu-item.dto';
import { MenuItemDetail } from './menu-item.model';
import { MenuItemEntity } from './entities/menu-item.entity';

const permissions = definePermission('menu-item', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
});

@Controller({
    path: 'menu-items',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Menu Item - Mô đun quản lý thực đơn')
export class MenuItemController {
    constructor(private readonly menuItemService: MenuItemService) {}

    @Get()
    @Perm(permissions.LIST)
    @ApiOperation({ summary: 'Lấy danh sách món ăn' })
    @ApiResult({ type: [MenuItemDetail], isPage: true })
    async list(
        @Query() query: MenuItemQueryDto
    ): Promise<Pagination<MenuItemDetail>> {
        return this.menuItemService.list(query);
    }

    @Get(':id')
    @Perm(permissions.READ)
    @ApiResult({ type: MenuItemDetail })
    @ApiOperation({ summary: 'Lấy thông tin món ăn' })
    async detail(@IdParam() id: number): Promise<MenuItemDetail> {
        return this.menuItemService.getMenuItemById(id);
    }

    @Post()
    @Perm(permissions.CREATE)
    @FormDataRequest()
    @ApiConsumes(ContentType.FORM_DATA)
    @ApiOperation({ summary: 'Thêm mới một món ăn' })
    @ApiResult({ type: MenuItemEntity })
    async create(@Body() dto: MenuItemDto) {
        return this.menuItemService.create(dto);
    }

    @Put(':id')
    @Perm(permissions.UPDATE)
    @FormDataRequest()
    @ApiConsumes(ContentType.FORM_DATA)
    @ApiOperation({ summary: 'Cập nhật món ăn' })
    @ApiResult({ type: MenuItemDetail })
    async update(
        @IdParam() id: number,
        @Body() dto: MenuItemDto
    ): Promise<MenuItemDetail> {
        return this.menuItemService.update(id, dto);
    }

    @Delete(':id')
    @Perm(permissions.DELETE)
    @ApiOperation({ summary: 'Xóa món ăn' })
    async delete(@IdParam() id: number) {
        await this.menuItemService.delete(id);
    }
}
