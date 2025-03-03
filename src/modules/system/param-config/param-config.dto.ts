import { ApiProperty } from '@nestjs/swagger';

import { StringField } from '~/common/decorators/field.decorator';
import { IsUnique } from '~/shared/database/constraints/unique.constraint';

import { ParamConfigEntity } from './param-config.entity';

export class ParamConfigDto {
    @StringField({ minLength: 3, maxLength: 50 })
    @ApiProperty({ description: 'Tên cấu hình', example: 'Mật khẩu khởi tạo' })
    name: string;

    @StringField({ maxLength: 50 })
    @IsUnique({
        entity: ParamConfigEntity,
        message: 'The key name already exists',
    })
    @ApiProperty({ description: 'Key cấu hình', example: 'SYS_INIT_PASSWORD' })
    key: string;

    @StringField({ maxLength: 255, required: false })
    @ApiProperty({ description: 'Giá trị cấu hình', example: 'a123456' })
    value: string;

    @StringField({ maxLength: 255, required: false })
    @ApiProperty({ description: 'Ghi chú', example: 'Mật khẩu khởi tạo' })
    remark: string;
}

