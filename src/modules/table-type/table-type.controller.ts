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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { ContentType } from '~/constants/http.constant';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { TableTypeDto, TableTypeUpdateDto } from './table-type.dto';
import { TableTypeService } from './table-type.service';
import { TableTypeDetail } from './table-type.model';
import { PagerDto } from '~/common/dto/pager.dto';
import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';

const permissions = definePermission('table-type', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
});

@Controller({
    path: 'table-types',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Table Type - Quản lý kiểu bàn ăn')
export class TableTypeController {
    constructor(private tableTypeService: TableTypeService) {}

    @Get()
    @Perm(permissions.LIST)
    @FormDataRequest()
    @ApiResult({ type: [TableTypeDetail], isPage: true })
    @ApiOperation({ summary: 'Lấy danh sách kiểu bàn' })
    async list(@Query() queryDto: PagerDto) {
        return this.tableTypeService.list(queryDto);
    }

    @Get(':id')
    @Perm(permissions.READ)
    @ApiResult({ type: TableTypeDetail })
    @ApiOperation({ summary: 'Lấy thông tin kiểu bàn' })
    async info(@IdParam() id: number) {
        return this.tableTypeService.info(id);
    }

    @Post()
    @Perm(permissions.CREATE)
    @FormDataRequest()
    @ApiOperation({ summary: 'Tạo kiểu bàn' })
    @ApiConsumes(ContentType.FORM_DATA)
    @ApiBody({
        type: TableTypeDto,
    })
    async create(@Body() dto: TableTypeDto) {
        await this.tableTypeService.create(dto);
    }

    @Put(':id')
    @Perm(permissions.UPDATE)
    @FormDataRequest()
    @ApiResult({ type: TableTypeDetail })
    @ApiConsumes(ContentType.FORM_DATA)
    @ApiOperation({ summary: 'Cập nhật kiểu bàn' })
    async update(
        @IdParam() id: number,
        @Body() dto: TableTypeUpdateDto
    ): Promise<TableTypeDetail> {
        return this.tableTypeService.update(id, dto);
    }

    @Delete(':id')
    @Perm(permissions.DELETE)
    @ApiOperation({ summary: 'Xoá kiểu bàn' })
    async delete(@IdParam() id: number): Promise<void> {
        await this.tableTypeService.delete(id);
    }
}
