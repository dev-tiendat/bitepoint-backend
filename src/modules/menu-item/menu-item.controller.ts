import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { ContentType } from '~/constants/http.constant';
import { MenuItemService } from './menu-item.service';
import { MenuItemDto } from './menu-item.dto';
import { IdParam } from '~/common/decorators/id-param.decorator';

@Controller({
    path: 'menu-items',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Menu Item - Mô đun quản lý thực đơn')
export class MenuItemController {
    constructor(private readonly menuItemService: MenuItemService) {}

    @Post()
    @FormDataRequest()
    @ApiConsumes(ContentType.FORM_DATA)
    @ApiOperation({ summary: 'Thêm mới một món ăn' })
    async create(@Body() dto: MenuItemDto) {
        await this.menuItemService.create(dto);
    }

    @Put(':id')
    @FormDataRequest()
    @ApiConsumes(ContentType.FORM_DATA)
    @ApiOperation({ summary: 'Cập nhật món ăn' })
    async update(@IdParam() id: number, @Body() dto: MenuItemDto) {
        await this.menuItemService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa món ăn' })
    async delete(@IdParam() id: number) {
        await this.menuItemService.delete(id);
    }
}
