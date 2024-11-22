import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { TableZoneService } from './table-zone.service';
import { TableZoneDto, TableZoneUpdateDto } from './table-zone.dto';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { TableZoneEntity } from './table-zone.entity';
import { TableService } from '../table/table.service';
import { TableDto, TableUpdateDto } from '../table/table.dto';
import { TableEntity } from '../table/table.entity';

@Controller({
    path: 'table-zone',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Table Zone - Quản lý khu vực bàn ăn và bàn ăn')
export class TableZoneController {
    constructor(
        private tableZoneService: TableZoneService,
        private tableService: TableService
    ) {}

    @Get()
    @ApiResult({ type: [TableZoneEntity] })
    @ApiOperation({ summary: 'Lấy danh sách khu vực bàn' })
    async list() {
        return this.tableZoneService.list();
    }

    @Post()
    @FormDataRequest()
    @ApiOperation({ summary: 'Tạo khu vực bàn' })
    async create(@Body() dto: TableZoneDto): Promise<void> {
        await this.tableZoneService.create(dto);
    }

    @Delete(':id')
    @FormDataRequest()
    @ApiOperation({ summary: 'Xoá khu vực bàn' })
    async delete(@IdParam() id: number): Promise<void> {
        await this.tableZoneService.delete(id);
    }

    @Get(':id/tables')
    @ApiResult({ type: [TableEntity] })
    @ApiOperation({ summary: 'Lấy danh sách bàn theo khu vực' })
    async listTables(@IdParam() id: number) {
        return this.tableService.listByZoneId(id);
    }

    @Post(':id/tables/:tableId')
    @FormDataRequest()
    @ApiOperation({ summary: 'Tạo bàn' })
    async createTable(
        @IdParam() tzId: number,
        @Param('tableId', ParseIntPipe) tableId: number,
        @Body() dto: TableDto
    ): Promise<void> {
        await this.tableService.create(tzId, dto);
    }

    @Put(':id/tables/:tableId')
    @FormDataRequest()
    @ApiOperation({ summary: 'Cập nhật bàn' })
    async updateTable(
        @IdParam() tzId: number,
        @Param('tableId', ParseIntPipe) tableId: number,
        @Body() dto: TableUpdateDto
    ): Promise<void> {
        await this.tableService.update(tzId, tableId, dto);
    }

    @Delete(':id/tables/:tableId')
    @FormDataRequest()
    @ApiOperation({ summary: 'Xoá bàn' })
    async deleteTable(
        @IdParam() tzId: number,
        @Param('tableId', ParseIntPipe) tableId: number
    ): Promise<void> {
        await this.tableService.delete(tzId, tableId);
    }
}
