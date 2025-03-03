import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';

import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';
import { OrderInfo } from '../order/order.model';
import { Public } from '../auth/decorators/public.decorator';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './reservation.dto';
import { ReservationDetail } from './reservation.model';

const permissions = definePermission('reservation', {
    LIST: 'list',
    CREATE: 'create',
});

@Controller({
    path: 'reservations',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Reservation - Đặt bàn ăn')
export class ReservationController {
    constructor(private reservationService: ReservationService) {}

    @Get()
    @Perm(permissions.LIST)
    @ApiOperation({ summary: 'Lấy danh sách đặt bàn hôm nay' })
    async list(): Promise<ReservationDetail[]> {
        return this.reservationService.list();
    }

    @Post()
    @Public()
    @ApiOperation({ summary: 'Tạo đơn đặt bàn' })
    async create(@Body() dto: ReservationDto) {
        await this.reservationService.create(dto);
    }

    @Get(':id/order-info')
    @Public()
    @ApiOperation({ summary: 'Lấy thông tin đơn hàng của đặt bàn' })
    async orderInfo(@IdParam() id: number): Promise<OrderInfo[]> {
        return this.reservationService.getOrderInfo(id);
    }
}
