import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';

import { Public } from '../auth/decorators/public.decorator';
import { TableDto, TableQueryDto, TableUpdateDto } from '../table/table.dto';
import { TableEntity } from '../table/table.entity';
import { TableService } from '../table/table.service';
import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';

import { TableZoneService } from './table-zone.service';
import { TableZoneDto } from './table-zone.dto';
import { TableZoneEntity } from './table-zone.entity';
import { TableZoneDetail } from './table-zone.model';
import { TableDetail } from '../table/table.model';
import { OrderService } from '../order/order.service';
import { TableCustomerInfo } from '../order/order.model';

const permissions = definePermission('table-zone', {
    CREATE: 'create',
    DELETE: 'delete',
    UPDATE: 'update',
    TABLE_LIST: 'table-list',
    CREATE_TABLE: 'create-table',
    DELETE_TABLE: 'delete-table',
    UPDATE_TABLE: 'update-table',
});

@Controller({
    path: 'table-zones',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Table Zone - Quản lý khu vực bàn ăn và bàn ăn')
export class TableZoneController {
    constructor(
        private tableZoneService: TableZoneService,
        private tableService: TableService,
        private orderService: OrderService
    ) {}

    @Get('tables')
    @Public()
    @ApiOperation({ summary: 'Lấy tất cả danh sách bàn ăn' })
    @ApiResult({ type: [TableEntity] })
    async getTableDetailList(): Promise<TableZoneDetail[]> {
        return this.tableZoneService.detailList();
    }

    @Get('tables/:id/info')
    @Public()
    @ApiOperation({ summary: 'Lấy thông tin đặt bàn' })
    async info(@IdParam() id: number): Promise<TableCustomerInfo[]> {
        return this.orderService.getTableCustomerInfo(id);
    }

    @Get()
    @Public()
    @ApiResult({ type: [TableZoneEntity] })
    @ApiOperation({ summary: 'Lấy danh sách khu vực bàn' })
    async list() {
        return this.tableZoneService.list();
    }

    @Post()
    @Perm(permissions.CREATE)
    @ApiOperation({ summary: 'Tạo khu vực bàn' })
    @FormDataRequest()
    @Perm(permissions.CREATE)
    async create(@Body() dto: TableZoneDto): Promise<void> {
        await this.tableZoneService.create(dto);
    }

    @Delete(':id')
    @Perm(permissions.DELETE)
    @ApiOperation({ summary: 'Xoá khu vực bàn' })
    @FormDataRequest()
    @Perm(permissions.DELETE)
    async delete(@IdParam() id: number): Promise<void> {
        await this.tableZoneService.delete(id);
    }

    @Get(':id/tables')
    @ApiOperation({ summary: 'Lấy danh sách bàn ăn theo khu vực' })
    @ApiResult({ type: [TableDetail] })
    async getTableList(
        @IdParam() tzId: number,
        @Query() query: TableQueryDto
    ): Promise<TableDetail[]> {
        return this.tableService.list(tzId, query);
    }

    @Get('tables/:tableId')
    @ApiOperation({ summary: 'Lấy thông tin bàn' })
    async getTableDetail(
        @Param('tableId', ParseIntPipe) tableId: number
    ): Promise<TableDetail> {
        return this.tableService.detail(tableId);
    }

    @Post(':id/tables')
    @FormDataRequest()
    @ApiOperation({ summary: 'Tạo bàn' })
    @Perm(permissions.CREATE_TABLE)
    async createTable(
        @IdParam() tzId: number,
        @Body() dto: TableDto
    ): Promise<void> {
        await this.tableService.create(tzId, dto);
    }

    @Put(':id/tables/:tableId')
    @FormDataRequest()
    @ApiOperation({ summary: 'Cập nhật bàn' })
    @Perm(permissions.UPDATE_TABLE)
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
    @Perm(permissions.DELETE_TABLE)
    async deleteTable(
        @IdParam() tzId: number,
        @Param('tableId', ParseIntPipe) tableId: number
    ): Promise<void> {
        await this.tableService.delete(tzId, tableId);
    }
}
