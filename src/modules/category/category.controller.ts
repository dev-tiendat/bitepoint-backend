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
import { definePermission, Perm } from '../auth/decorators/permission.decorator';

import { CategoryDto, CategoryQueryDto, CategoryUpdateDto } from './category.dto';
import { CategoryService } from './category.service';
import { CategoryDetail } from './category.model';

export const permissions = definePermission('category', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
});

@Controller({
    path: 'categories',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Category - Mô đun quản lý danh mục')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @Perm(permissions.LIST)
    @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục' })
    async list(@Query() queryDto: CategoryQueryDto) {
        return this.categoryService.list(queryDto);
    }

    @Get(':id')
    @Perm(permissions.READ)
    @ApiOperation({ summary: 'Lấy thông tin một danh mục' })
    async info(@IdParam() id: number) {
        return this.categoryService.info(id);
    }

    @Post()
    @Perm(permissions.CREATE)
    @ApiOperation({ summary: 'Thêm mới một danh mục' })
    @ApiConsumes(ContentType.FORM_DATA)
    @FormDataRequest()
    async create(@Body() dto: CategoryDto) {
        await this.categoryService.create(dto);
    }

    @Put(':id')
    @Perm(permissions.UPDATE)
    @ApiOperation({ summary: 'Cập nhập một danh mục' })
    @ApiConsumes(ContentType.FORM_DATA)
    @FormDataRequest()
    @ApiResult({ type: CategoryDetail })
    async update(@IdParam() id: number, @Body() dto: CategoryUpdateDto) {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    @Perm(permissions.DELETE)
    @ApiOperation({ summary: 'Xóa một danh mục' })
    async delete(@IdParam() id: number) {
        await this.categoryService.delete(id);
    }
}
