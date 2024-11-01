import { UsePipes } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsEmpty,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    ValidateIf,
} from 'class-validator';
import dayjs from 'dayjs';
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
    @Matches(/^(0[3|5|7|8|9])+([0-9]{9})$/)
    phone: string;

    @ApiProperty({ description: 'Ngày sinh' })
    @Transform(({ value }) =>
        value ? dayjs.unix(value).toDate() : dayjs('01-01-2000').toDate()
    )
    birthDate: Date;
}
