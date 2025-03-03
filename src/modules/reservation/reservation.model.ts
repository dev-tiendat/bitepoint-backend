import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CommonModel } from '~/common/model/response.model';

import { OrderInfo } from '../order/order.model';
import { ReservationStatus } from './reservation.constant';

export class ReservationDetail extends CommonModel {
    @AutoMap()
    @ApiProperty({ description: 'Tên khách hàng' })
    customerName: string;

    @AutoMap()
    @ApiProperty({ description: 'Số điện thoại' })
    phone: string;

    @AutoMap()
    @ApiProperty({ description: 'Địa chỉ Email' })
    email: string;

    @AutoMap()
    @ApiProperty({ description: 'Số lượng' })
    guestCount: number;

    @AutoMap()
    @ApiProperty({ description: 'Yêu cầu đặc biệt' })
    specialRequest: string;

    @AutoMap()
    @ApiProperty({ description: 'Ngày đặt bàn' })
    reservationTime: number;

    @AutoMap()
    @ApiProperty({ description: 'Trạng thái đặt bàn' })
    status: ReservationStatus;

    @AutoMap(() => OrderInfo)
    @ApiProperty({ description: 'Danh sách đơn hàng' })
    orders?: OrderInfo[];
}
