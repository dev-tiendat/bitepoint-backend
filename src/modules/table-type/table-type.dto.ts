import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

import { NumberField, StringField } from '~/common/decorators/field.decorator';

export class TableTypeDto {
    @ApiProperty({ description: 'Tên loại bàn', example: 'Bàn đôi' })
    @StringField({ maxLength: 70 })
    name: string;

    @ApiProperty({ description: 'Số lượng người tối đa', example: 2 })
    @NumberField({ int: true, positive: true })
    maxCapacity: number;

    @IsDefined()
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    @ApiProperty({ type: 'string', format: 'binary', description: 'Tài liệu' })
    image: MemoryStoredFile;
}

export class TableTypeUpdateDto extends PartialType(TableTypeDto) {}
