import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsEnum, ValidateIf } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

import {
    DateField,
    PhoneField,
    StringField,
} from '~/common/decorators/field.decorator';
import { UserGender } from '~/modules/user/user.constant';

export class RegisterDto {
    @ApiProperty({ description: 'Tên tài khoản', example: 'tiendat' })
    @StringField({ match: /^[a-zA-Z0-9]{4,20}$/ })
    username: string;

    @ApiProperty({ description: 'Mật khẩu', example: 'TienDat01' })
    @StringField({ match: /^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i })
    password: string;

    @ApiProperty({ description: 'Họ', example: 'Phạm' })
    @StringField({ match: /^[a-zA-ZÀ-ỹ]+( [a-zA-ZÀ-ỹ]+)*$/i })
    firstName: string;

    @ApiProperty({ description: 'Tên', example: 'Đạt' })
    @StringField({ match: /^[a-zA-ZÀ-ỹ]+( [a-zA-ZÀ-ỹ]+)*$/i })
    lastName: string;

    @ApiProperty({ description: 'Giới tính (0: Nữ, 1: Nam, 2: Khác))' })
    @IsEnum(UserGender)
    gender: number;

    @ApiProperty({ description: 'Địa chỉ Email', example: 'abc123@gmail.com' })
    @ValidateIf(object => !IsEmpty(object))
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Số điện thoại', example: '09899999999' })
    @PhoneField({ required: false })
    phone: string;

    @ApiProperty({ description: 'Ngày sinh' })
    @DateField()
    birthDate: number;
}

export class LoginDto {
    @ApiProperty({
        description: 'Tên tài khoản hoặc số điện thoại',
        example: 'tiendat',
    })
    @StringField()
    usernameOrPhone: string;

    @ApiProperty({ description: 'Mật khẩu', example: 'TienDat01' })
    @StringField()
    password: string;
}

export class PasswordUpdateDto {
    @ApiProperty({ description: 'Mật khẩu', example: 'TienDat01' })
    @StringField({ match: /^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i })
    oldPassword: string;

    @ApiProperty({ description: 'Mật khẩu', example: 'TienDat01' })
    @StringField({ match: /^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i })
    newPassword: string;
}

export class AccountUpdateDto extends PartialType(
    OmitType(RegisterDto, ['username', 'password'])
) {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Ảnh đại diện',
    })
    @ValidateIf(o => o.avatar)
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    avatar?: MemoryStoredFile;
}

export class RefreshTokenDto {
    @ApiProperty({ description: 'Refresh token ' })
    @StringField()
    refreshToken: string;
}
