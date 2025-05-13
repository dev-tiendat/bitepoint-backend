import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { PagerDto } from '~/common/dto/pager.dto';

export class LoginLogQueryDto extends PagerDto {
    @ApiProperty({ description: 'Tên tài khoản' })
    @IsString()
    @IsOptional()
    username: string;

    @ApiProperty({ description: 'Địa chỉ IP' })
    @IsOptional()
    @IsString()
    ip?: string;

    @ApiProperty({ description: 'Nơi đăng nhập' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ description: 'Thời gian đăng nhập' })
    @IsOptional()
    @IsArray()
    time?: string[];
}
