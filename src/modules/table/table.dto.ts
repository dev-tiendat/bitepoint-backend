import { ApiProperty, PartialType } from '@nestjs/swagger';

import { NumberField, StringField } from '~/common/decorators/field.decorator';

import { TableStatus } from './table.constant';

export class TableDto {
    @ApiProperty({ description: 'Tên bàn', example: 'A1' })
    @StringField({ maxLength: 50, upperCase: true })
    name: string;

    @ApiProperty({ description: 'Tên bàn', example: 'A1' })
    @NumberField()
    tableTypeId: number;

    @ApiProperty({ description: 'ID khu vực bàn ăn' })
    @NumberField({ in: [0, 1] })
    show: number;
}

export class TableUpdateDto extends PartialType(TableDto) {}

export class CheckInDto {
    @ApiProperty({ description: 'ID bàn ăn' })
    ids: number[];
}

export class FindOptimalTableDto {
    @ApiProperty({ description: 'Tên khách hàng' })
    @StringField({ maxLength: 255, required: false })
    customerName: string;

    @ApiProperty({ description: 'Số lượng khách hàng' })
    @NumberField({ int: true, positive: true })
    guestCount: number;
}

export class AssignTableDto {
    @ApiProperty({ description: 'Mã đặt bàn' })
    @NumberField()
    reservationId: number;
    @ApiProperty({ description: 'Mã bàn ăn' })
    @NumberField()
    tableIds: number[];
}

export class TableQueryDto {
    @ApiProperty({ description: 'Trạng thái bàn ăn' })
    status: TableStatus;
}
