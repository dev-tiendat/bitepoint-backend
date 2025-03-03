import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
    DateField,
    NumberField,
    StringField,
} from '~/common/decorators/field.decorator';

export class VoucherDto {
    @ApiProperty({ description: 'Tên voucher', example: 'Voucher 1' })
    @StringField({ maxLength: 255 })
    name: string;

    @ApiProperty({ description: 'Mã voucher', example: 'VOUCHER_001' })
    @StringField({ maxLength: 50 })
    code: string;

    @ApiProperty({ description: 'Số tiền voucher', example: 1000 })
    @NumberField({ positive: true })
    discount: number;

    @ApiProperty({ description: 'Ngày hết hạn voucher', example: '2021-12-31' })
    @DateField()
    expirationDate: Date;
}

export class ApplyVoucherDto {
    @StringField()
    orderId: string;

    @StringField()
    voucherCode: string;
}
