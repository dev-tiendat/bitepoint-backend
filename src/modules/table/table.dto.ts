import { ApiProperty, PartialType } from '@nestjs/swagger';
import { NumberField, StringField } from '~/common/decorators/field.decorator';

export class TableDto {
    @ApiProperty({ description: 'Tên bàn' })
    @StringField({ maxLength: 50, upperCase: true })
    tableName: string;

    @NumberField()
    tableTypeId: number;
}

export class TableUpdateDto extends PartialType(TableDto) {}
