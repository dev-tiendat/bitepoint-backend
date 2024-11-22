import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class TableZoneInfo {
    @AutoMap()
    @ApiProperty({ description: 'Tên khu vực' })
    zoneName: string;
}
