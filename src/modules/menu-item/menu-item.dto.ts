import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsIn } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

import { NumberField, StringField } from '~/common/decorators/field.decorator';
import { MenuItemStatus } from './menu-item.constant';
import { IsEntityExist } from '~/shared/database/constraints/entity-exists.constraint';
import { CategoryEntity } from '../category/category.entity';

export class MenuItemDto{
    @StringField({ maxLength: 255 })
    name: string;

    @StringField({ maxLength: 255 })
    description: string;

    @NumberField({ positive: true })
    price: number;

    @IsDefined()
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    @ApiProperty({ type: 'string', format: 'binary', description: 'Tài liệu' })
    image: MemoryStoredFile;

    @NumberField()
    @IsIn([0, 1])
    popular: number;

    @IsEnum(MenuItemStatus)
    status: MenuItemStatus;

    @IsEntityExist({ entity: CategoryEntity, field: 'id' })
    categoryId: number;
}

export class MenuItemUpdateDto extends PartialType(MenuItemDto) {}
