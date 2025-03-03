import { ApiProperty } from '@nestjs/swagger';

import { GateWayType } from '../gateway/gateway.interface';

export class PaymentInfo {
    @ApiProperty({ description: 'Tên chủ tài khoản' })
    name: string;

    @ApiProperty({ description: 'Ngân hàng' })
    bank: GateWayType;

    @ApiProperty({ description: 'Số tài khoản' })
    account: string;

    @ApiProperty({ description: 'Nội dung chuyển khoản' })
    content: string;

    @ApiProperty({ description: 'Số tiền thanh toán' })
    amount: number;

    @ApiProperty({ description: 'QR code' })
    qrCode: string;
}
