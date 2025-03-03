import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { TableStatus } from './table.constant';

export class TableInfo {
    @ApiProperty({ description: 'ID bàn ăn' })
    @AutoMap()
    id: string;

    @ApiProperty({ description: 'Tên bàn ăn' })
    @AutoMap()
    name: string;

    @ApiProperty({ description: 'Trạng thái bàn ăn' })
    @AutoMap()
    status: TableStatus;

    @ApiProperty({ description: 'Hình ảnh bàn ăn' })
    @AutoMap()
    image: string;
}

export class TableDetail extends TableInfo {
    @ApiProperty({ description: 'ID khu vực bàn ăn' })
    @AutoMap()
    tableZoneId: number;

    @ApiProperty({ description: 'Hiện bàn ăn' })
    @AutoMap()
    show: number;

    @ApiProperty({ description: 'Mô tả bàn ăn' })
    @AutoMap()
    createdAt: number;

    @ApiProperty({ description: 'Ngày cập nhật' })
    @AutoMap()
    updatedAt: number;
}
