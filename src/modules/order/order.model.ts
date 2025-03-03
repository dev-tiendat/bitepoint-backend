import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { OrderItemStatus, OrderStatus } from './order.constant';
import { TableInfo } from '../table/table.model';
import { ReservationDetail } from '../reservation/reservation.model';
import { VoucherInfo } from '../voucher/voucher.model';

export class OrderInfo {
    @AutoMap()
    @ApiProperty({ description: 'ID đơn hàng' })
    orderId: string;

    @AutoMap()
    @ApiProperty({ description: 'Tên bàn' })
    tableName?: string;

    @AutoMap()
    @ApiProperty({ description: 'QR code' })
    qrcode: string;
}

export class OrderSummary {
    @AutoMap()
    @ApiProperty({ description: 'ID đơn hàng' })
    id: string;

    @AutoMap()
    @ApiProperty({ description: 'Thời gian vào bàn' })
    orderTime: number;

    @AutoMap()
    @ApiProperty({ description: 'Tổng tiền đơn hàng' })
    totalPrice: number;

    @AutoMap()
    @ApiProperty({ description: 'Trạng thái' })
    status: OrderStatus;

    @AutoMap(() => TableInfo)
    @ApiProperty({ description: 'Thông tin bàn ăn' })
    table: TableInfo;

    @AutoMap(() => ReservationDetail)
    @ApiProperty({ description: 'Thông tin dặt bàn' })
    reservation: ReservationDetail;
}

export class OrderDetail extends OrderSummary {
    @AutoMap(() => VoucherInfo)
    @ApiProperty({ description: 'Voucher' })
    voucher: VoucherInfo;
    
    @ApiProperty({ description: 'Danh sách món ăn' })
    @AutoMap(() => OrderItemInfo)
    orderItems: OrderItemInfo[];
}

export class TableCustomerInfo {
    @ApiProperty({ description: 'Tên khách hàng' })
    @AutoMap()
    customerName: string;

    @ApiProperty({ description: 'Số lượng khách' })
    @AutoMap()
    guestCount: number;

    @ApiProperty({ description: 'Thòi gian vào bàn' })
    @AutoMap()
    orderTime: number;

    @ApiProperty({ description: 'ID Bàn ăn đã đặt' })
    @AutoMap()
    tableId: number;
}

export class OrderItemInfo {
    @ApiProperty({ description: 'ID món ăn' })
    @AutoMap()
    id: number;

    @ApiProperty({ description: 'Số lượng' })
    @AutoMap()
    quantity: number;

    @ApiProperty({ description: 'Hình ảnh' })
    @AutoMap()
    image: string;

    @ApiProperty({ description: 'Giá' })
    @AutoMap()
    price: number;

    @ApiProperty({ description: 'Tên món ăn' })
    @AutoMap()
    name: string;

    @ApiProperty({ description: 'Ghi chú' })
    @AutoMap()
    note: string;

    @ApiProperty({ description: 'Trạng thái' })
    @AutoMap()
    status: OrderItemStatus;

    @ApiProperty({ description: 'Dục ra món' })
    @AutoMap()
    urged: number;

    @ApiProperty({ description: 'Thời gian đặt hàng' })
    @AutoMap()
    createdAt: Date;
}

export class OrderItemDetail extends OrderItemInfo {
    @ApiProperty({ description: 'ID đơn hàng' })
    @AutoMap()
    orderId: string;

    @ApiProperty({ description: 'Tên bàn ăn' })
    @AutoMap()
    tableName: string;
}
