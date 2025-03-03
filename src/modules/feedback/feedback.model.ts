import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackDetail {
    @AutoMap()
    @ApiProperty({ description: 'ID' })
    id: number;

    @AutoMap()
    @ApiProperty({ description: 'Tên khách hàng' })
    customerName: string;

    @AutoMap()
    @ApiProperty({ description: 'Đánh giá' })
    rating: number;

    @AutoMap()
    @ApiProperty({ description: 'Bình luận' })
    comments: string;

    @AutoMap()
    @ApiProperty({ description: 'Ngày tạo' })
    createdAt: Date;

    @AutoMap()
    @ApiProperty({ description: 'Tên bàn ăn' })
    tableName: string;
}
