import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
    IsEmail,
    IsEmpty,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    ValidateIf,
} from 'class-validator';
import { DateField, PhoneField, StringField } from '~/common/decorators/field.decorator';
import { UserGender } from '~/modules/user/user.constant';

export class RegisterDto {
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

    // @ApiProperty({ description: 'Ảnh đại diện' })
    // @IsOptional()
    // avatar?: string;

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
}

export class LoginDto {
    @ApiProperty({ description: 'Tên tài khoản hoặc số điện thoại' , example: 'tiendat' })
    @StringField()
    usernameOrPhone: string;

    @ApiProperty({ description: 'Mật khẩu' , example: 'TienDat01' })
    @StringField()
    password: string;
}

export class PasswordUpdateDto {
    @ApiProperty({ description: 'Mật khẩu', example: 'TienDat01' })
    @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
        message:
            'Password must include numbers, letters, and be 6-16 characters long',
    })
    oldPassword: string;

    @ApiProperty({ description: 'Mật khẩu', example: 'TienDat01' })
    @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
        message:
            'Password must include numbers, letters, and be 6-16 characters long',
    })
    newPassword: string;
}

export class AccountUpdateDto extends PartialType(
    OmitType(RegisterDto, ['username', 'password'])
) {}

export class RefreshTokenDto {
    @ApiProperty({ description: 'Refresh token ' })
    @StringField()
    refreshToken: string;
}
