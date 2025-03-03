import { IsEntityExist } from '~/shared/database/constraints/entity-exists.constraint';
import { UserEntity } from '../user.entity';
import {
    ArrayMaxSize,
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsEmpty,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';
import {
    DateField,
    NumberField,
    PhoneField,
} from '~/common/decorators/field.decorator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagerDto } from '~/common/dto/pager.dto';
import { UserGender, UserStatus } from '../user.constant';
import { isEmpty } from 'lodash';

export class UserDto {
    @ApiProperty({ description: 'Tên tài khoản', example: 'tiendat' })
    @IsString()
    @Matches(/^[a-zA-Z0-9]{4,20}$/)
    username: string;

    @ApiProperty({ description: 'Mật khẩu', example: 'TienDat01' })
    @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
        message:
            'Password must include numbers, letters, and be 6-16 characters long',
    })
    password: string;

    @ApiProperty({ description: 'Họ', example: 'Phạm' })
    @IsString()
    @Matches(/^[a-zA-ZÀ-ỹ]+( [a-zA-ZÀ-ỹ]+)*$/i)
    firstName: string;

    @ApiProperty({ description: 'Tên', example: 'Đạt' })
    @IsString()
    @Matches(/^[a-zA-ZÀ-ỹ]+( [a-zA-ZÀ-ỹ]+)*$/i)
    lastName: string;

    @ApiProperty({ description: 'Giới tính (0: Nữ, 1: Nam, 2: Khác))' })
    @IsEnum(UserGender)
    gender: number;

    @ApiProperty({ description: 'Địa chỉ Email', example: 'abc123@gmail.com' })
    @IsEmail()
    @ValidateIf(object => !IsEmpty(object))
    email: string;

    @ApiProperty({ description: 'Số điện thoại', example: '09899999999' })
    @IsOptional()
    @PhoneField()
    phone: string;

    @ApiProperty({ description: 'Ngày sinh' })
    @DateField()
    birthDate: Date;

    @ApiProperty({ description: 'Vai trò', type: [Number] })
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    roleIds: number[];

    @ApiProperty({ description: '状态' })
    @IsIn([0, 1])
    status: number;
}

export class UserUpdateDto extends PartialType(UserDto) {}

export class UserQueryDto extends PagerDto {
    @ApiProperty({ description: 'Trạng thái món ăn' })
    status: UserStatus;
}
