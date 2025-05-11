import { ApiProperty } from '@nestjs/swagger';

import { RoleInfo } from '~/modules/system/role/role.model';

export class AuthToken {
    @ApiProperty({ description: 'Mã thông báo nhân dạng JWT' })
    accessToken: string;

    @ApiProperty({ description: 'Mã lấy lại AccessToken' })
    refreshToken: string;
}

export class AuthLoginResult {
    @ApiProperty({ description: 'Tên tài khoản' })
    username: string;

    @ApiProperty({ description: 'Họ và tên' })
    fullName: string;

    @ApiProperty({ description: 'Ảnh đại diện' })
    avatar: string;

    @ApiProperty({ description: 'Vai trò' })
    roles: RoleInfo[];

    @ApiProperty({ description: 'Mã token' })
    tokens: AuthToken;
}
