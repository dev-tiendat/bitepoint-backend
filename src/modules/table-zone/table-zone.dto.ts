import { ApiProperty, PartialType } from '@nestjs/swagger';

import { StringField } from '~/common/decorators/field.decorator';
import { IsUnique } from '~/shared/database/constraints/unique.constraint';

import { TableZoneEntity } from './table-zone.entity';

export class TableZoneDto {
    @StringField({ maxLength: 50, upperCase: true })
    @IsUnique({
        entity: TableZoneEntity,
        message: 'A dictionary with the same zone name already exists',
    })
    @ApiProperty({ description: 'Tên khu vực ', example: 'Tầng 1' })
    name: string;
}

export class TableZoneUpdateDto extends PartialType(TableZoneDto) {}