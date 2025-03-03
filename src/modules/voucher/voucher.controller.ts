import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { PagerDto } from '~/common/dto/pager.dto';

import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';
import { VoucherService } from './voucher.service';
import { ApplyVoucherDto, VoucherDto } from './voucher.dto';
import { ApiResult } from '~/common/decorators/api-result.decorator';

const permissions = definePermission('voucher', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
});

@Controller({
    path: 'vouchers',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Voucher - Quản lý voucher')
export class VoucherController {
    constructor(private voucherService: VoucherService) {}

    @Get()
    @Perm(permissions.LIST)
    @ApiResult({ type: [VoucherDto], isPage: true })
    @ApiOperation({ summary: 'Lấy danh sách voucher' })
    async list(@Query() queryDto: PagerDto) {
        return this.voucherService.list(queryDto);
    }

    @Post('apply')
    @ApiOperation({ summary: 'Áp mã voucher vào đơn hàng' })
    async applyVoucher(@Body() applyVoucherDto: ApplyVoucherDto) {
        return this.voucherService.applyVoucher(applyVoucherDto);
    }

    @Post()
    @Perm(permissions.CREATE)
    @ApiOperation({ summary: 'Tạo voucher' })
    async create(@Body() dto: VoucherDto) {
        await this.voucherService.create(dto);
    }
}
