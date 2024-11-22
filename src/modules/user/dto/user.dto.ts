import { IsEntityExist } from '~/shared/database/constraints/entity-exists.constraint';
import { UserEntity } from '../user.entity';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { NumberField } from '~/common/decorators/field.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @IsNumber()
    @ApiProperty({ description: 'Tên tài khoản', example: 'tiendat' })
    // @IsEntityExist({ entity: UserEntity, field: 'username' }, { each: true })
    id: number;
}
