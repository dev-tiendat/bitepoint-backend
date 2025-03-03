import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { UserGender } from './user.constant';
import { AutoMap } from '@automapper/classes';
import { CommonModel } from '~/common/model/response.model';

export class AccountInfo {
    @ApiProperty({ description: 'ID' })
    @AutoMap()
    id: number;

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
    birthDate: Date;

    @ApiProperty({ description: 'Địa chỉ mail' })
    @AutoMap()
    email: string;

    @ApiProperty({ description: 'Số điện thoại' })
    @AutoMap()
    phone: string;

    @ApiProperty({ description: 'Ảnh đại diện' })
    @AutoMap()
    avatar: string;

    @ApiProperty({ description: 'Trạng thái' })
    @AutoMap()
    status: number;

    @ApiProperty({ description: 'Vai trò' })
    @AutoMap()
    roles: string[];
}

export class UserDetail extends IntersectionType(AccountInfo, CommonModel) {}
