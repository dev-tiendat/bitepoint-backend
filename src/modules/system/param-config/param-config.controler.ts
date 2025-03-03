import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
    definePermission,
    Perm,
} from '~/modules/auth/decorators/permission.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { PagerDto } from '~/common/dto/pager.dto';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { Pagination } from '~/helper/paginate/pagination';

import { ParamConfigService } from './param-config.service';
import { ParamConfigDto } from './param-config.dto';
import { ParamConfigInfo } from './param-config.model';

export const permissions = definePermission('system:param-config', {
    LIST: 'list',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
});

@ApiTags('Param Config - Mô-đun quản lý cấu hình hệ thống')
@ApiSecurityAuth()
@Controller({
    path: 'param-config',
    version: '1',
})
export class ParamConfigController {
    constructor(private paramConfigService: ParamConfigService) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách cấu hình' })
    @ApiResult({ type: ParamConfigInfo, isPage: true })
    @Perm(permissions.LIST)
    async list(@Query() query: PagerDto): Promise<Pagination<ParamConfigInfo>> {
        return this.paramConfigService.list(query);
    }

    @Post()
    @ApiOperation({ summary: 'Thêm cấu hình tham số' })
    @Perm(permissions.CREATE)
    async create(@Body() dto: ParamConfigDto): Promise<void> {
        await this.paramConfigService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật cấu hình tham số' })
    @Perm(permissions.UPDATE)
    async update(
        @IdParam() id: number,
        @Body() dto: ParamConfigDto
    ): Promise<void> {
        await this.paramConfigService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa cấu hình tham số đã chỉ định' })
    @Perm(permissions.DELETE)
    async delete(@IdParam() id: number): Promise<void> {
        await this.paramConfigService.delete(id);
    }
}
