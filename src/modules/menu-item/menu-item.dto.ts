import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

import { NumberField, StringField } from '~/common/decorators/field.decorator';
import { IsEntityExist } from '~/shared/database/constraints/entity-exists.constraint';

import { CategoryEntity } from '../category/category.entity';

import { MenuItemStatus } from './menu-item.constant';
import { IsUnique } from '~/shared/database/constraints/unique.constraint';
import { MenuItemEntity } from './entities/menu-item.entity';
import { PagerDto } from '~/common/dto/pager.dto';

export class MenuItemDto {
    @ApiProperty({ description: 'Tên món ăn', example: 'Cơm gà' })
    @IsUnique({ entity: MenuItemEntity, field: 'name' })
    @StringField({ maxLength: 255 })
    name: string;

    @ApiProperty({ description: 'Mô tả món ăn', example: 'Cơm gà Hải Nam' })
    @StringField({ maxLength: 255 })
    description: string;

    @ApiProperty({ description: 'Giá món ăn', example: 10000 })
    @NumberField({ min: 0 })
    price: number;

    @ValidateIf(o => o.image)
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    @ApiProperty({ type: 'string', format: 'binary', description: 'Tài liệu' })
    image: MemoryStoredFile;

    @ApiProperty({ description: 'Món ăn phổ biến', example: 1 })
    @NumberField({ in: [0, 1] })
    popular: number;

    @ApiProperty({ description: 'Trạng thái món ăn', example: 1 })
    @IsEnum(MenuItemStatus)
    status: MenuItemStatus;

    @IsEntityExist({ entity: CategoryEntity })
    categoryId: number;
}

export class MenuItemUpdateDto extends PartialType(MenuItemDto) {}

export class MenuItemQueryDto extends PagerDto {
    @ApiProperty({ description: 'Trạng thái món ăn' })
    @IsEnum(MenuItemStatus)
    @IsOptional()
    status: MenuItemStatus;
}
