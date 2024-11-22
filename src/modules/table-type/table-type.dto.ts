import {
    ApiProperty,
    IntersectionType,
    PartialType,
    PickType,
} from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { StringField } from '~/common/decorators/field.decorator';
import { PagerDto } from '~/common/dto/pager.dto';

export class TableTypeDto {
    @ApiProperty({ description: 'Tên loại bàn', example: 'Khu 1' })
    @StringField({ maxLength: 70, required: false })
    name: string;

    @IsDefined()
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    @ApiProperty({ type: 'string', format: 'binary', description: 'Tài liệu' })
    image: MemoryStoredFile;
}

export class TableTypeUpdateDto extends PartialType(TableTypeDto){}

export class TableTypeQueryDto extends IntersectionType(
    PagerDto<TableTypeDto>,
    PartialType(PickType(TableTypeDto, ['name']))
) {}
