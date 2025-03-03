import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CommonModel } from '~/common/model/response.model';

export class VoucherInfo {
    @ApiProperty({ description: 'Mã voucher', example: 'VOUCHER_001' })
    @AutoMap()
    code: string;

    @ApiProperty({ description: 'Số tiền giảm giá', example: 1000 })
    @AutoMap()
    discount: number;
}

export class VoucherDetail extends CommonModel {
    @ApiProperty({ description: 'Tên voucher', example: 'Voucher 1' })
    @AutoMap()
    name: string;

    @ApiProperty({ description: 'Mã voucher', example: 'VOUCHER_001' })
    @AutoMap()
    code: string;

    @ApiProperty({ description: 'Số tiền giảm giá', example: 1000 })
    @AutoMap()
    discount: number;

    @ApiProperty({ description: 'Ngày hết hạn', example: '2021-12-31' })
    @AutoMap()
    expirationDate: number;
}
