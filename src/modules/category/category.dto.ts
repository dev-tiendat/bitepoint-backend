import { ApiProperty, PartialType } from '@nestjs/swagger';
import { StringField } from '~/common/decorators/field.decorator';
import { IsUnique } from '~/shared/database/constraints/unique.constraint';
import { CategoryEntity } from './category.entity';

export class CategoryDto {
    @ApiProperty({ description: 'Tên danh mục', example: 'Đồ uống' })
    @StringField({ maxLength: 255 })
    @IsUnique({ entity: CategoryEntity, field: 'name' })
    name: string;

    @ApiProperty({ description: 'Mô tả danh mục' })
    @StringField({ maxLength: 255 })
    description: string;
}

export class CategoryUpdateDto extends PartialType(CategoryDto) {}
