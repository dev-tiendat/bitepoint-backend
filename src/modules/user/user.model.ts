import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from './user.constant';
import { AutoMap } from '@automapper/classes';

export class AccountInfo {
    @ApiProperty({ description: 'Tên tài khoản' })
    @AutoMap()
    username: string;

    @ApiProperty({ description: 'Họ' })
    @AutoMap()
    firstName: string;

    @ApiProperty({ description: 'Tên' })
    @AutoMap()
    lastName: string;

    @ApiProperty({ description: 'Giới tính' })
    @AutoMap(() => Number)
    gender: UserGender;

    @ApiProperty({ description: 'Ngày sinh' })
    @AutoMap()
    birthDate: number;

    @ApiProperty({ description: 'Địa chỉ mail' })
    @AutoMap()
    email: string;

    @ApiProperty({ description: 'Số điện thoại' })
    @AutoMap()
    phone: string;

    @ApiProperty({ description: 'Ảnh đại diện' })
    @AutoMap()
    avatar: string;

    @ApiProperty({ description: 'Vai trò' })
    @AutoMap()
    roles: string[];
}
