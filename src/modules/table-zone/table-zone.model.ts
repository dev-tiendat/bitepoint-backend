import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { TableInfo } from '../table/table.model';

export class TableZoneInfo {
    @ApiProperty({ description: 'ID khu vực' })
    id: number;

    @ApiProperty({ description: 'Tên khu vực' })
    name: string;
}

export class TableZoneDetail {
    @ApiProperty({ description: 'ID khu vực' })
    @AutoMap()
    id: string;

    @ApiProperty({ description: 'Tên khu vực' })
    @AutoMap()
    name: string;

    @ApiProperty({ description: 'Danh sách bàn' })
    @AutoMap(() => TableInfo)
    tables: TableInfo[];
}
