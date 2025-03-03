import { ApiProperty } from '@nestjs/swagger';

import { NumberField, StringField } from '~/common/decorators/field.decorator';

export class FeedbackDto {
    @NumberField({ min: 1, max: 5 })
    @ApiProperty({ description: 'Đánh giá', example: 5 })
    rating: number;

    @StringField({ required: false })
    @ApiProperty({ description: 'Bình luận', example: 'Rất ngon' })
    comments: string;
}
