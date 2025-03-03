import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
    @ApiProperty({ description: 'ID đặt món' })
    orderId: string;

    @ApiProperty({ description: 'Danh sách món ăn' })
    items: OrderMenuItemDto[];
}

export class OrderMenuItemDto {
    @ApiProperty({ description: 'ID món ăn' })
    id: number;

    @ApiProperty({ description: 'Số lượng' })
    quantity: number;

    @ApiProperty({ description: 'Ghi chú' })
    note: string;
}

export class OrderItemStatusUpdateDto {
    @ApiProperty({description: 'ID đặt món'})
    orderId: string;

    @ApiProperty({description: 'ID món ăn đặt món'})
    orderItemId: number;
}