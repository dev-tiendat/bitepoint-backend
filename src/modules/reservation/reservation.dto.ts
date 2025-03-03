import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, ValidateIf } from 'class-validator';

import {
    DateField,
    NumberField,
    PhoneField,
    StringField,
} from '~/common/decorators/field.decorator';

export class ReservationDto {
    @ApiProperty({ description: 'Tên khách hàng', example: 'Nguyễn Văn A' })
    @StringField({ maxLength: 255 })
    customerName: string;

    @ApiProperty({ description: 'Số điện thoại', example: '0123456789' })
    @PhoneField()
    phone: string;

    @ApiProperty({ description: 'Địa chỉ Email', example: 'abc123@gmail.com' })
    @IsEmail()
    @ValidateIf(object => !IsEmpty(object))
    email: string;

    @ApiProperty({ description: 'Ngày đặt bàn', example: '1043201243' })
    @DateField()
    reservationTime: number;

    @ApiProperty({ description: 'Số lượng', example: 5 })
    @NumberField({ int: true, positive: true })
    guestCount: number;

    @StringField({ required: false })
    specialRequest: string;
}
