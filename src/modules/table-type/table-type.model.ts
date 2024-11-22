import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from '~/common/model/response.model';

export class TableTypeDetail extends Timestamp {
    @AutoMap()
    @ApiProperty({ description: 'Tên bàn' })
    name: string;

    @AutoMap()
    @ApiProperty({ description: 'Đường dẫn hình ảnh' })
    image: string;
}
