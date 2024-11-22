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
import {
    TableTypeDto,
    TableTypeQueryDto,
    TableTypeUpdateDto,
} from './table-type.dto';
import { TableTypeService } from './table-type.service';
import { TableTypeDetail } from './table-type.model';

@Controller({
    path: 'table-type',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Table Type - Quản lý kiểu bàn ăn')
export class TableTypeController {
    constructor(private tableTypeService: TableTypeService) {}

    @Get()
    @FormDataRequest()
    @ApiResult({ type: [TableTypeDetail], isPage: true })
    @ApiOperation({ summary: 'Lấy danh sách kiểu bàn' })
    async list(@Query() dto: TableTypeQueryDto) {
        return this.tableTypeService.list(dto);
    }

    @Post()
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
    @FormDataRequest()
    @ApiConsumes(ContentType.FORM_DATA)
    @ApiOperation({ summary: 'Cập nhật kiểu bàn' })
    async update(
        @IdParam() id: number,
        @Body() dto: TableTypeUpdateDto
    ): Promise<void> {
        await this.tableTypeService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xoá kiểu bàn' })
    async delete(@IdParam() id: number): Promise<void> {
        if (await this.tableTypeService.checkTableByTableTypeId(id))
            throw new BadRequestException(
                'This table type has associated tables and cannot be deleted'
            );
        await this.tableTypeService.delete(id);
    }
}
