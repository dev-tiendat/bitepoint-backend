import { ApiProperty, PartialType } from '@nestjs/swagger';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

import { StringField } from '~/common/decorators/field.decorator';
import { PagerDto } from '~/common/dto/pager.dto';
import { IsUnique } from '~/shared/database/constraints/unique.constraint';

import { CategoryEntity } from './category.entity';

export class CategoryDto {
    @ApiProperty({ description: 'Tên danh mục', example: 'Đồ uống' })
    @StringField({ minLength: 3, maxLength: 255 })
    @IsUnique({ entity: CategoryEntity, field: 'name' })
    name: string;

    @ApiProperty({ description: 'Mô tả danh mục' })
    @StringField({ maxLength: 255, required: false })
    description: string;

    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    @ApiProperty({ type: 'string', format: 'binary', description: 'Tài liệu' })
    image: MemoryStoredFile;
}

export class CategoryUpdateDto extends PartialType(CategoryDto) {}

export class CategoryQueryDto extends PagerDto<CategoryEntity> {}
