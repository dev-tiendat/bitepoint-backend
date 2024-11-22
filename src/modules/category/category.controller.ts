import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { CategoryDto, CategoryUpdateDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller({
    path: 'categories',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Category - Mô đun quản lý danh mục')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục' })
    async list() {
        return this.categoryService.list();
    }

    @Post()
    @ApiOperation({ summary: 'Thêm mới một danh mục' })
    @FormDataRequest()
    async create(@Body() dto: CategoryDto) {
        await this.categoryService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhập một danh mục' })
    @FormDataRequest()
    async update(@IdParam() id: number, @Body() dto: CategoryUpdateDto) {
        await this.categoryService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa một danh mục' })
    async delete(@IdParam() id: number) {
        await this.categoryService.delete(id);
    }
}
