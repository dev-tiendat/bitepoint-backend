import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Matches } from 'class-validator';

import {
    ArrayField,
    NumberField,
    StringField,
} from '~/common/decorators/field.decorator';
import { OperatorDto } from '~/common/dto/operator.dto';
import { IsUnique } from '~/shared/database/constraints/unique.constraint';

import { RoleEntity } from './role.entity';
import { RoleStatus } from './role.constant';
import { AutoMap } from '@automapper/classes';

export class RoleDto extends OperatorDto {
    @ApiProperty({ description: 'Tên nhóm quyền', example: 'Admin' })
    @StringField({ minLength: 2 })
    name: string;

    @ApiProperty({ description: 'Mã vai trò', example: 'admin' })
    @IsUnique({ entity: RoleEntity })
    @StringField({ minLength: 2 })
    @Matches(/^[a-z0-9]+$/i, { message: 'Role ID must be alphanumeric' })
    value: string;

    @ApiProperty({ description: 'Ghi chú', example: 'Nhóm quản trị' })
    @StringField({ required: false })
    remark?: string;

    @ApiProperty({ description: 'Trạng thái', example: RoleStatus.ACTIVE })
    @NumberField({ in: [RoleStatus.ACTIVE, RoleStatus.INACTIVE] })
    status: number;

    @ApiProperty({ description: 'Danh sách ID menu' })
    @ArrayField({ type: 'number' })
    menuIds: number[];
}

export class RoleInfo {
    @ApiProperty({ description: 'Tên nhóm quyền' })
    @AutoMap()
    name: string;

    @ApiProperty({ description: 'Mã vai trò' })
    @AutoMap()
    value: string;
}

export class RoleUpdateDto extends PartialType(RoleDto) {}
