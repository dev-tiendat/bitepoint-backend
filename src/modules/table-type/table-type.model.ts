import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { CommonModel } from '~/common/model/response.model';

export class TableTypeDetail extends CommonModel {
    @AutoMap()
    @ApiProperty({ description: 'Tên bàn' })
    name: string;

    @AutoMap()
    @ApiProperty({ description: 'Đường dẫn hình ảnh' })
    image: string;

    @AutoMap()
    @ApiProperty({ description: 'Số lượng người tối đa' })
    maxCapacity: number;
}
